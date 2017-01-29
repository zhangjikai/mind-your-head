/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-6
 * Time: 下午2:43
 */
GAME.Manager = {
    score: 0,
    grades: [
        {enemySpeed: 4, enemyNum: 10, eBulletSpeed: 10, eShootTime: 500, score: 5},
        {enemySpeed: 4.5, enemyNum: 15, eBulletSpeed: 11, eShootTime: 480, score: 6},
        {enemySpeed: 5, enemyNum: 20, eBulletSpeed: 12, eShootTime: 450, score: 7},
        {enemySpeed: 5.5, enemyNum: 25, eBulletSpeed: 13, eShootTime: 430, score: 8},
        {enemySpeed: 6, enemyNum: 30, eBulletSpeed: 14, eShootTime: 400, score: 9},
        {enemySpeed: 6.5, enemyNum: 35, eBulletSpeed: 15, eShootTime: 380, score: 10},
        {enemySpeed: 7, enemyNum: 40, eBulletSpeed: 15, eShootTime: 350, score: 11},
        {enemySpeed: 7.5, enemyNum: 45, eBulletSpeed: 15, eShootTime: 330, score: 12},
        {enemySpeed: 8, enemyNum: 50, eBulletSpeed: 16, eShootTime: 320, score: 13},
        {enemySpeed: 8, enemyNum: 50, eBulletSpeed: 16, eShootTime: 300, score: 14}
    ],

    startSingleGame: function (gradeIndex, camera, scene) {
        var grade = this.grades[gradeIndex];
        GAME.SharedVar.enemysNum = grade.enemyNum;
        $('#last_num').html(GAME.SharedVar.enemysNum);
        $('#score_num').html(0);
        GAME.SharedVar.enenyOnShow = 10;
        GAME.gameStart.setScore(grade.score);
        var length = 10;
        var enemy;
        while (length--) {
            enemy = GAME.ObjectPool.getCommonEnemy();
            enemy.speed = grade.enemySpeed;
            /*enemy.speed = 8;*/
            enemy.eBulletSpeed = grade.eBulletSpeed;
            enemy.shootTime = grade.eShootTime;
            //enemy.shootTime = 200000;
            //enemy.speed = 10;
            //enemy.eBulletSpeed = 50;
           // enemy.shootTime = 100;
            enemy.beginCommonEnemy(GAME.ObjectPool.enemys, camera, scene);
        }
    },

    startScoreGame: function (camera, scene) {
        $('#last_num').html("NAN");
        $('#score_num').html(0);
        GAME.SharedVar.enenyOnShow = 10;
        this.score = 5;
        var length = 10;
        var enemy;
        while (length--) {
            enemy = GAME.ObjectPool.getCommonEnemy();
            enemy.speed = 6;
            enemy.eBulletSpeed = 10;
            enemy.shootTime = 500;
            enemy.beginCommonEnemy(GAME.ObjectPool.enemys, camera, scene);
        }
    },

    setScoreGame: function (i, camera, scene) {
        this.score++;
        var length = 10;
        var enemys = GAME.ObjectPool.enemys;
        var enemy;
        while (length--) {
            enemy = enemys[length];
            enemy.speed = i;
            enemy.eBulletSpeed = i * 1.5;
            enemy.shootTime = 500 - i * 20;
        }
    },

    startFightGame: function (camera, scene) {
        GAME.SharedVar.enemysNum = 100;
        GAME.SharedVar.enenyOnShow = 10;
        var length = 9;
        var enemy;
        while (length--) {
            enemy = GAME.ObjectPool.getCommonEnemy();
            enemy.speed = 5;
            enemy.eBulletSpeed = 15;
            enemy.shootTime = 1000;
            //enemy.shootTime = 300000;
            enemy.beginCommonEnemy(GAME.ObjectPool.enemys, camera, scene);
        }
        GAME.msgHandler.rivalEnemy = GAME.ObjectPool.getRivalEnemy();
        GAME.msgHandler.rivalEnemy.beginRivalEnemy(camera, scene);
    },

    genProp:function(){

    }
};