GAME.Protocol = {
	// 协议字符串的长度
	"PROTOCOL_LENGTH" : 2,

/*	"NICK_NAME" : "⊙#", // 返回nickname //to client
	"CLOSE_OR_QUIT" : "⊙￠",// 退出游戏 或 网页被关闭 //to client
	"JOIN_PAIRS" : "&*", // JOIN_PAIRS+对方昵称 ，申请加入对方。 //server
	"SOMEONE_JOIN" : "↑↓", // 有人加入，配对成功 //to client
	"JOIN_SUCCESS" : "∏∑", // 通知申请者，连接成功 //to client
	"JOIN_FAIL" : "★【", // 通知申请者，连接不成功 //to client
	"QUIT_GAME" : "★%", // 通知对方，我要退出游戏 //server
	"SOMEONE_QUIT" : "★★",// 被通知，对方退出游戏 //to client
	"TRANSMIT_DATA" : "♀￡",// 发送数据 //server
	"RECEIVE_DATA" : "♀￡", // 接收到数据 //to client
	"NO_PAIR" : "￡￡", // 如果没有对手，试图给对方发送， //to client*/

    //websocke
    'CLOSE_OR_QUIT' : '☆☆',	//退出游戏 或 网页被关闭				//to client
    'JOIN_PAIRS' : '△℃',		//JOIN_PAIRS+对方昵称  ，申请加入对方。	//server
    'SOMEONE_JOIN' : '∑∷',		//有人加入，配对成功					//to client
    'JOIN_SUCCESS' : '∩∩',		//通知申请者，连接成功					//to client
    'JOIN_FAIL' : 'J*',			//通知申请者，连接不成功				//to client
    'QUIT_GAME' : '●‰',			//通知对方，我要退出游戏				//server
    'SOMEONE_QUIT' : '◎s',		//被通知，对方退出游戏					//to client
    'TRANSMIT_DATA' : '∷¤',	//发送数据								//server
    'RECEIVE_DATA' : '♀♀',		//接收到数据							//to client
    'NO_PAIR' : '￡￡',			//如果没有对手，试图给对方发送			//to client

    "BULLET":"<>",
    "POSITION":"><",
    "REMOVE_COMMON_BULLET":"</",
    "REMOVE_RIVAL_BULLET":"/>",
    "HIT_RIVAL_ENEMY":"tt",
    "HIT_BY_ENEMY":"zz",
    "RIVAL_LOST":"pp",
    "PREPARE":"ss"
};