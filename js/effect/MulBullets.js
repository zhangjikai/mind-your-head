/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-11-9
 * Time: 下午2:22
 * To change this template use File | Settings | File Templates.
 */
GAME.MulBullets = function (bulletNums, radius) {
    this.bulletNums = bulletNums || 4;
    this.radius = radius || 50;
    this.scene = null;
    this.bulletArray = [];
    console.log(bulletNums);
}

GAME.MulBullets.prototype = {
    constructor: GAME.MulBullets,

    initMulBulltes: function () {
        var bullet = null;
        var length = this.bulletNums;
        while (length--) {
            bullet = new GAME.OtherBullet({
                radius: this.radius,
                color: 0xffff00,
                speed:1
            });
            bullet.initOtherBullet();
            this.bulletArray.push(bullet);
        }
    },

    isShow: function () {
        var length = this.bulletNums;
        while (length--) {
            if (this.bulletArray[length].isShow) {
                return true;
            }
        }
        return false;
    },

    updateMulBullets: function () {
        var length = this.bulletNums;
        while (length--) {
            this.bulletArray[length].updateOtherBullet();
        }
    },

    checkCollsions: function () {
        var length = this.bulletArray.length;
        var enemys = GAME.ObjectPool.enemys;
        var length2;
        while (length--) {
            var bullet = this.bulletArray[length];
            //console.log(bullet.isShow);
            length2 = enemys.length;
            if (bullet.isShow) {
                while (length2--) {
                    if (enemys[length2].isShow && GAME.Helper.checkCollision(bullet.mesh, enemys[length2].mesh)) {
                        bullet.removeOtherBullet();
						document.getElementById('hitm').play();
                        enemys[length2].removeEnemy();
                        GAME.gameStart.handleHit(enemys[length2].mesh.position);
                    }
                }
            }
        }
    },

    beginMulBullets: function (position, camera, scene) {
        var length = this.bulletNums;
        while (length--) {
            this.bulletArray[length].beginOtherBulletBumb(position, camera, scene);
        }
    }
}