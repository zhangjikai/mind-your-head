/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-2
 * Time: 下午7:58
 */
GAME.msgHandler = {
    rivalEnemy: null,
    handlePosition: function (content) {
        var position = JSON.parse(content);
        this.rivalEnemy.setPosition(position);
    },

    handleBullet: function (content) {
        var msg = JSON.parse(content);
        GAME.ObjectPool.getEnemyBullet().beginFightBullet(msg, this.rivalEnemy.mesh.position,
            GAME.gameStart.getCamera(), GAME.gameStart.getScene());
    },

    handleRemoveCommonBullet: function (content) {
        var id = content;
        var enemyBullets = GAME.ObjectPool.enemyBullets;
        var length = GAME.ObjectPool.enemyBullets.length;
        while (length--) {
            if (enemyBullets[length].id == id && enemyBullets[length].isShow) {
                enemyBullets[length].removeEnemyBullet();
                GAME.Helper.targetShowCount = 0;
            }
        }
    },

    handleRemoveRivalBullet: function (content) {
        var id = content;
        var length = GAME.ObjectPool.commonBullets.length;
        while (length--) {
            if (GAME.ObjectPool.commonBullets[length].id == id && GAME.ObjectPool.commonBullets[length].isShow) {
                GAME.ObjectPool.commonBullets[length].removeCommonBullet();
            }
        }
    },

    handleHitRivalEnemy: function () {
        /*console.log('被击中了');*/
        var text = '#heart' + GAME.SharedVar.lifeSpare;
        $(text).css({
            display: 'none'
        });
        GAME.SharedVar.lifeSpare--;
    },

    handleHitByEnemy: function () {
        var text = '#heart' + GAME.SharedVar.rivalLife;
        $(text).css({
            display: 'none'
        });
        GAME.SharedVar.rivalLife--;
    },

    handleRivalLost: function () {
    	 var text = '#heart' + GAME.SharedVar.rivalLife;
         $(text).css({
             display: 'none'
         });
        GAME.SharedVar.rivalLife--;
        //GAME.gameStart.reset();
        GAME.gameStart.stop();
        //GAME.gameStart.removeListener();
        alert("恭喜你胜利！！！即将返回游戏大厅");
        window.location.href = 'server/GameHall.jsp';
      /*  var flag = confirm('恭喜你胜利！！！是否重新开始？？？');
        if (flag) {
            GAME.preOrder++;
            GAME.Server.sendMessage(GAME.Protocol.TRANSMIT_DATA
                + GAME.Protocol.PREPARE + GAME.preOrder);
            GAME.waitHelper.showWaiting();
            if(GAME.SharedVar.firstIn) {
                GAME.SharedVar.firstIn = false;
                window.location.search = GAME.SharedVar.search;
            } else {
                window.location.reload();
            }
        } else {
            //跳转
            window.location.href = 'server/GameHall.jsp';
        }*/
    },

    handlePrepare: function (content) {
        var order = parseInt(content);
        console.log(order);
        if (order == 0) {
            /* GAME.SharedVar.preOrder = 1;*/
            GAME.preOrder = 1;
            /*console.log(GAME.SharedVar.preOrder);*/
            /* GAME.Server.sendMessage(GAME.Protocol.TRANSMIT_DATA + GAME.Protocol.PREPARE + 1);*/
        }
        if (order == 1) {
            if (GAME.preOrder == 1) {
                GAME.Server.sendMessage(GAME.Protocol.TRANSMIT_DATA + GAME.Protocol.PREPARE + 2);
                GAME.gameStart.stop();
                this.handleRestart(1);
            }
        }
        if (order == 2) {
            GAME.gameStart.stop();
            this.handleRestart(2);
        }
    },

    handleRestart: function (type) {
        GAME.waitHelper.hiddenWaiting();
        GAME.SharedVar.enemysNum = 100;
        GAME.SharedVar.enenyOnShow = 10;
        GAME.SharedVar.lifeSpare = 5;
        GAME.SharedVar.rivalLife = 10;
        GAME.preOrder = 0;
        GAME.gameStart.setCameraPosition(type);
        var camera = GAME.gameStart.getCamera();
        var scene = GAME.gameStart.getScene();
        var length = 11;
        while (length--) {
            var text = '#heart' + length;
            $(text).css({
                display: 'block'
            });
        }

        var enemys = GAME.ObjectPool.enemys;
        length = enemys.length;
        while (length--) {
            if (enemys[length].type == GAME.Constants.COMMON_ENEMY)
                enemys[length].beginCommonEnemy(enemys, camera, scene);
            else
                enemys[length].beginRivalEnemy(camera, scene);

        }
        /*var bullets = GAME.ObjectPool.commonBullets;
        length = bullets.length;
        while (length--) {
            if (bullets[length].isShow) {
                bullets[length].removeCommonBullet();
            }
        }
        bullets = GAME.ObjectPool.enemyBullets;
        length = bullets.length;
        while (length--) {
            if (bullets[length].isShow) {
                bullets[length].removeEnemyBullet();
            }
        }*/

        //GAME.gameStart.addListener();
        GAME.gameStart.animate();
    }
}