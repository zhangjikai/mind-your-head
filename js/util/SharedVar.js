/**
 * 用来存放程序中共享的一些变量
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-8-21
 * Time: 下午6:50
 */

GAME.SharedVar = GAME.SharedVar || {};

GAME.SharedVar.scWidthHalf = window.innerWidth / 2;
GAME.SharedVar.scHeightHalf = window.innerHeight / 2;

GAME.SharedVar.initScreenVlaues = function() {
    GAME.SharedVar.scWidthHalf = window.innerWidth / 2;
    GAME.SharedVar.scHeightHalf = window.innerHeight / 2;
}

/**  游戏模式*/
GAME.SharedVar.gameMode = GAME.Constants.SINGLE_MODE;

GAME.SharedVar.gameType = GAME.Constants.GRADE_MODE;

GAME.SharedVar.gravity = 1;

GAME.SharedVar.music = 1;

GAME.SharedVar.sound = 1;

/** 剩余的血量*/
GAME.SharedVar.lifeSpare = 5;

GAME.SharedVar.rivalLife = 10;

/*GAME.SharedVar.preOrder = 0;*/
/** 敌人的数量*/
GAME.SharedVar.enemysNum = 10;

GAME.SharedVar.enenyOnShow = 10;

GAME.SharedVar.left = false;
GAME.SharedVar.right = false;
GAME.SharedVar.up = false;
GAME.SharedVar.down = false;