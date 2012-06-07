(function() {
    //socket.io 0.7移行に対応したライブラリを読み込む
    var io = require('lib/socket.io-titanium');
    //ipaddressとportを指定してsocket serverに接続する。
    var socket = io.connect('192.168.1.13:3000');
    
    //socket.io 0.7から一つのポートで接続先を複数洗濯できる。
    //log用のソケットに接続する。
    var log = socket.of('/log');
    log.on('error', function(){
        console.info('not connect log server.');
    });
    log.on('disconnect', function(){
        console.info('disconnect log server.');
    });
    
    //接続が完了した場合に呼ばれるCallback
    log.on('connected', function(msg){
        console.info('log server connected');
    });
    //commonjsの拡張を行う。
    //例 console.info('hoge');
    module.exports.info = function(message){
        Ti.API.info(message);
        /*
         * メッセージをログサーバーに送る。
         * appName : アプリケーションのな前
         * macAddress : クライアントを一意に判断する為のMacAddress
         * time : 送信日時
         * level : ログのレベル
         * msg : メッセージテキスト
         */
        log.emit('logging', {
            appName:Ti.App.getName(),
            macAddress:Ti.Platform.getMacaddress(),
            time:new Date(),
            level:'INFO',
            msg:message,
        });
    }
    //commonjsの拡張を行う。
    //例 console.info('hoge');
    module.exports.warn = function(message){
        Ti.API.warn(message);
 
        log.emit('logging', {
            appName:Ti.App.getName(),
            macAddress:Ti.Platform.getMacaddress(),
            time:new Date(),
            level:'WARN',
            msg:message,
        });
    }
})();