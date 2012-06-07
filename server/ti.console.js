/*
 * Titaniumからの接続処理
 */
var http =  require('http'),
    io = require('socket.io').listen(3000),
    mongo = require('mongodb');
    
//log用のソケットを作成
var log = io.of('/log');
//connection成功時のCallback
log.on('connection', function(socket){
    console.log('client connected');
    //接続が成功したことをクライアントに知らせる。
    socket.emit('connected', 'connected');
    
    //DBから取得したテーブルを保持する変数。
    var Logs;
    //DBを指定して開く
    var db = new mongo.Db('test',
        new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {}), {});
    db.open(function(err, db) {
        console.log('db opened');
        // DBの中身を全て削除する
        // db.dropDatabase(function(err, result) {
            // console.info('drop database');
        //collection(tableみたいなの)を開く
        db.collection('logs', function(err,collection) { 
            Logs = collection;
        });
        //クライアントのログを受け取るCallback
        socket.on('logging', function(value){
            console.info('insert log');
            console.dir(value);
            //log collectionにレコードを追加する。
            Logs.insert({
                'appName':value.appName,
                'macAddress':value.macAddress,
                'time':value.time,
                'level':value.level,
                'msg':value.msg
            });
        });
        //切断された時のCallback
        socket.on('disconnect', function(socket){
            console.log('client disconnected');
            db.close();
        });
        // });
    });
});

/*
 * こっからはブラウザ側の実装
 */
//http frameworkのexpressを利用
var express = require('express');
//httpサーバーを8080を立ち上げる
var app = express.createServer();
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
	res.render('index.ejs', {
		layout : false
	});
});
app.listen(8080);

// /view でsocketを開始する
var view = io.of('/view');
view.on('connection', function(client){
    console.log('browser connected.');
    client.send('接続しました。');
    
    //DBを開いてログを取得する
    var db = new mongo.Db('test',
        new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {}), {});
    db.open(function(err, db) {
        db.collection('things', function(err,collection) { 
            collection.find({},function(err,cursor){
                cursor.each(function(err,value){
                    if(value != null) {
                        console.dir(value);
                        client.json.send(value);
                    }else{
                        //とりあえずDBは開きっぱなし。
                        
                        // Destory the collection
                        // collection.drop(function(err, collection) {
                        //     db.close();
                        // });
                    }
                });
            });
        });
        
        /* 最新のデータを要求する処理
         * value.time : 前回取得したログの中で最新の日付を定義。
         */
        client.on('request', function(value){
            var currentTime = value.time;
            console.log('last requested time is :%s', currentTime);
            db.collection('logs', function(err,collection) { 
                collection.find({},function(err,cursor){
                    //時間の昇順で取得。
                    cursor.sort({time:1}).each(function(err,value){
                        //前回取得したログより新しいものだけをクライアントに送る。
                        if(value != null && Date.parse(value.time) > Date.parse(currentTime)) {
                            console.log('each %s',value.time);
                            client.json.send(value);
                        }else{
                            // Destory the collection
                            // collection.drop(function(err, collection) {
                            //     db.close();
                            // });
                        }
                    });
                });
            });
        });
        
        client.on('clear', function(value){
            db.dropDatabase(function(err, result) {
                console.info('drop database');
            });
        });
        
        client.on('disconnect', function(socket){
            console.log('browser disconnected');
            db.close();
        });
    });
});

console.info('Socket Server running at localhost:3000');
console.info('Http Server running at http://localhost:8080/');