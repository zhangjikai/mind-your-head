/**
 * websocket连接及通信
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-7-30
 * Time: 上午10:19
 */
GAME.Server = GAME.Server || {};
/** 用于传递信息的socket */
GAME.Server.socket = null;

GAME.Server.connect = (function (host) {
    if ('WebSocket' in window) {
        GAME.Server.socket = new WebSocket(host);
    } else if ('MozWebSocket' in window) {
        GAME.Server.socket = new MozWebSocket(host);
    } else {
        console.log('Error: WebSocket is not supported by this browser.');
        return;
    }

    GAME.Server.socket.onopen = function () {
        console.log('Info: WebSocket connection opened.');

        if (!!window.location.search.substring(1).split("&")[1]) {
            if (window.location.search.substring(1).split("&")[1] === "num=1") {
                //隐藏div GameWebsocket ， 显示div waiting
                GAME.waitHelper.showWaiting();
            } else if (window.location.search.substring(1).split("&")[1] === "num=2"
                && !!window.location.search.substring(1).split("&")[2]) {
                //隐藏div waiting ， 显示div GameWebsocket
                /*GAME.Server.socket.send(GAME.Protocol.JOIN_PAIRS + window.location.search.substring(1).split("&")[5]);*/
                GAME.Server.socket.send(GAME.Protocol.JOIN_PAIRS + window.location.search.split("&")[2].substring(5));
            }
        }
    };

    GAME.Server.socket.onclose = function () {
        GAME.Server.socket.send(GAME.Protocol.QUIT_GAME);
        //window.location.href = 'server/logout';
        console.log('Info: WebSocket closed....');
    };

    GAME.Server.socket.onmessage = function (message) {
        /* console.log(message.data);*/
        var type = message.data.substring(0, 2);
        var content = message.data.substring(2);
        var msg;
        switch (type) {
            case GAME.Protocol.NICK_NAME:
                console.log(content);
                break;
            case GAME.Protocol.CLOSE_OR_QUIT:
            case GAME.Protocol.SOMEONE_QUIT:
                //退出游戏处理
                /*showWaiting();*/
                GAME.gameStart.stop();
                window.location.href = "server/GameHall.jsp";
                break;
            case GAME.Protocol.SOMEONE_JOIN:
                //有人加入你，配对成功
                if (!!window.location.search.substring(1).split("&")[1]
                    && window.location.search.substring(1).split("&")[1] === "num=1") {
                    GAME.SharedVar.firstIn = true;
                    GAME.SharedVar.search = window.location.search.split('&')[0] +
                        '&num=2' + '&peer=' + content;
                }
                start(GAME.Constants.FIRST_PLACE);
                break;
            case GAME.Protocol.JOIN_SUCCESS:
                //通知申请者，连接成功
                start(GAME.Constants.SECOND_PLACE);
                break;
            case GAME.Protocol.JOIN_FAIL:
                //通知申请者，连接不成功
                break;
            case GAME.Protocol.NO_PAIR:
                //没有对手
                break;
            case GAME.Protocol.RECEIVE_DATA:
                //信息传递
                type = content.substring(0, 2);
                content = content.substring(2);
                handleMessage(type, content);
        }
    }

    function handleMessage(type, content) {
        switch (type) {
            case GAME.Protocol.POSITION:
                /* var position = JSON.parse(content);
                 cube.position.set(position.x * 5, position.y * 5, position.z * 5);*/
                GAME.msgHandler.handlePosition(content);
                break;
            case GAME.Protocol.BULLET:
                GAME.msgHandler.handleBullet(content);
                break;
            case GAME.Protocol.REMOVE_COMMON_BULLET:
                GAME.msgHandler.handleRemoveCommonBullet(content);
                break;
            case GAME.Protocol.REMOVE_RIVAL_BULLET:
                GAME.msgHandler.handleRemoveRivalBullet(content);
                break;
            case GAME.Protocol.HIT_RIVAL_ENEMY:
                GAME.msgHandler.handleHitRivalEnemy();
                break;
            case GAME.Protocol.HIT_BY_ENEMY:
                GAME.msgHandler.handleHitByEnemy();
                break;
            case GAME.Protocol.RIVAL_LOST:
                GAME.msgHandler.handleRivalLost();
                break;
            case GAME.Protocol.PREPARE:
                GAME.msgHandler.handlePrepare(content);
                break;
        }
    }

    function start(type) {
        GAME.gameStart.init();
        GAME.gameStart.setCameraPosition(type);
        GAME.gameStart.animate();
        GAME.Manager.startFightGame(GAME.gameStart.getCamera(), GAME.gameStart.getScene());
        GAME.Server.sendMessage(GAME.Protocol.TRANSMIT_DATA + GAME.Protocol.POSITION + JSON.stringify(GAME.gameStart.getCamera().position));
        GAME.waitHelper.hiddenWaiting();
    }

});


GAME.Server.initialize = function () {
    if (window.location.protocol == 'http:') {
        GAME.Server.connect('ws://' + window.location.host + '/game/server/GameWebSocketServlet');
    } else {
        GAME.Server.connect('wss://' + window.location.host + '/game/server/GameWebSocketServlet');
    }
}

GAME.Server.sendMessage = function (message) {
    if (message != '') {
        GAME.Server.socket.send(message);
    }
}
