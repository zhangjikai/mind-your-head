/**
 * 程序中使用的一些常量(不可写的变量)
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-8-20
 * Time: 下午4:01
 */
GAME.Constants = {
    /** 重力感应*/
    DIRECTION_X_MOVE: 0,
    DIRECTION_Y_MOVE: 1,
    /** 场景移动方向*/
    DIRECTION_LEFT_MOVE:2,
    DIRECTION_RIGHT_MOVE:3,
    DIRECTION_UP_MOVE : 4,
    DIRECTION_DOWN_MOVE: 5,
    DIRECTION_NONE_MOVE:6,


    /** 更改大小*/
    WINDOW_WIDTH_CHANGE: 10,
    WINDOW_HEIGHT_CHANGE: 11,
    CREEN_ASPECT_RADIO: window.innerWidth / window.innerHeight,

    /** 怪物越界的方向*/
    X_OUT_BOUNDS: 20,
    Y_OUT_BOUNDS: 21,
    Z_OUT_BOUNDS: 22,
    MIN_OUT_BOUNDS: 23,
    NO_OUT_BOUNDS: 24,

    /** 相机初始化的位置*/
    FIRST_PLACE: 30,
    SECOND_PLACE: 31,

    /** 游戏模式*/
    SINGLE_MODE: 40,
    FIGHT_MODE: 41,
    SCORE_MODE:42,
    GRADE_MODE:43,

    /** 敌人的类型*/
    COMMON_ENEMY: 50,
    RIVAL_ENEMY: 51,
    COMMON_ENEMY_BULLET: 52,
    RIVAL_ENEMY_BULLET: 53,

    /** 雪花效果的类型*/
    SNOW_SPHERE: 60,
    SNOW_PARTICLE: 61,

    /**脸部产生变形的类型*/
    FACE_COMMON:70,
    FACE_EYE_BROW_UP:71,
    FACE_EYE_BROW_DOWN:72,
    FACE_NOSE_MOUTH_UP:73,
    FACE_NOSE_MOUTH_DOWN:74,
    FACE_MOUSE_UP:75,
    FACE_MOUSE_DOWN:76,
    FACE_SIZE_BIG:77,
    FACE_SIZE_SMALL:78,
    FACE_OPEN_MOUSE:79,

    PROPS_HEART:'images/operationPanel/small/heart.png',
    PROPS_LASER:'images/operationPanel/small/laser.png',
    PROPS_SNOW:'images/operationPanel/small/snowflake.png',
    PROPS_BUMB:'images/operationPanel/small/lightning.png'



}

Object.defineProperties(GAME.Constants, {
    DIRECTION_X_MOVE: {writable: false},
    DIRECTION_Y_MOVE: {writable: false},
    WINDOW_WIDTH_CHANGE: {writable: false},
    WINDOW_HEIGHT_CHANGE: {writable: false},
    X_OUT_BOUNDS: {writable: false},
    Y_OUT_BOUNDS: {writable: false},
    Z_OUT_BOUNDS: {writable: false},
    NO_OUT_BOUNDS: {writable: false},
    
    FIRST_PLACE: {writable: false},
    SECOND_PLACE: {writable: false},

    /** 游戏模式*/
    SINGLE_MODE: {writable: false},
    FIGHT_MODE: {writable: false},
    SCORE_MODE:{writable: false},
    GRADE_MODE:{writable: false},

    /** 敌人的类型*/
    COMMON_ENEMY: {writable: false},
    RIVAL_ENEMY: {writable: false},
    COMMON_ENEMY_BULLET: {writable: false},
    RIVAL_ENEMY_BULLET: {writable: false},

    /** 雪花效果的类型*/
    SNOW_SPHERE: {writable: false},
    SNOW_PARTICLE: {writable: false},

    PROPS_HEART:{writable: false},
    PROPS_LASER:{writable: false},
    PROPS_SNOW:{writable: false},
    PROPS_LIGHT:{writable: false}
});
