/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-5
 * Time: 下午2:16
 */
GAME.Operate = function () {
    var commonCount = 0;
    var laserCount = 0;
    var bumbCount = 0;
    var snowCount = 0;
    var canCommonShoot = true;
    var canLaserShoot = true;
    var canSnowShoot = true;
    var canBumbShoot = true;
    var bulletIndex = 0;
    var laseLeft = localStorage.getItem('laserLeft') || 10;
    var snowLeft = localStorage.getItem('snowLeft') || 10;
    var bumbLeft = localStorage.getItem('lightLeft') || 10;

    this.commonShoot = function (vector, camera, scene) {
        if (canCommonShoot) {

            if (GAME.SharedVar.gameMode != GAME.Constants.FIGHT_MODE) {
                var otherBullets = GAME.ObjectPool.otherBullets;
                var length = otherBullets.length;
                while (length--) {
                    if (otherBullets[length].isShow) {
                        otherBullets[length].removeOtherBullet();
                        console.log(otherBullets[length].mesh.position)
                        GAME.ObjectPool.getMulBullets().beginMulBullets(otherBullets[length].mesh.position, camera, scene);
                        return;
                    }
                }
                var bullet = GAME.ObjectPool.getCommonBullet();
                bullet.beginCommonBullet(vector, camera, scene);
            }
            if (GAME.SharedVar.gameMode == GAME.Constants.FIGHT_MODE) {
            	 var otherBullets = GAME.ObjectPool.otherBullets;
                 var length = otherBullets.length;
                 while (length--) {
                     if (otherBullets[length].isShow) {
                         otherBullets[length].removeOtherBullet();
                         console.log(otherBullets[length].mesh.position)
                         GAME.ObjectPool.getMulBullets().beginMulBullets(otherBullets[length].mesh.position, camera, scene);
                         return;
                     }
                 }
                var bullet = GAME.ObjectPool.getCommonBullet();
                bullet.beginCommonBullet(vector, camera, scene);
                bullet.id = bulletIndex++;
                var msg = {
                    "id": bullet.id,
                    "speed": bullet.speed,
                    "vector": vector
                }
                GAME.Server.sendMessage(GAME.Protocol.TRANSMIT_DATA + GAME.Protocol.BULLET + JSON.stringify(msg));
            }
            canCommonShoot = false;
            commonCount = 0;
        }
    }

    this.laserShoot = function (scene) {
        if (canLaserShoot) {
            GAME.ObjectPool.getLaserParticle().beginLaser(scene);
            canLaserShoot = false;
            laserCount = 0;
            document.getElementById("laser").className = "laser_cool";
            laseLeft--;
            localStorage.setItem('laserLeft', laseLeft);
            GAME.Sound.playLaserSound();

        }
    }

    this.snowShoot = function (vector, camera, scene) {
        if (canSnowShoot) {
            GAME.ObjectPool.getSnowSphere().beginCommonBullet(vector, camera, scene);
            canSnowShoot = false;
            snowCount = 0;
            document.getElementById("snowflake").className = "snow_cool";
            snowLeft--;
            localStorage.setItem('snowLeft', snowLeft);
            $('#snowflake_num').html(snowLeft);
            GAME.Sound.playIceSound();
        }
    }

    this.bumbShoot = function (vector, camera, scene) {
        if (canBumbShoot) {
            GAME.ObjectPool.getOtherBullet().beginOtherBullet(vector, camera, scene);
            canBumbShoot = false;
            bumbCount = 0;
            document.getElementById("lighting").className = 'lighting_cool';
            bumbLeft--;
            console.log('bumbLeft', bumbLeft);
            localStorage.setItem('lightLeft', bumbLeft);
            $('#lighting_num').html(bumbLeft);
            GAME.Sound.playIceSound();
        }
    }

    this.updateCount = function () {
        if (commonCount++ >= 10) {
            canCommonShoot = true;
            commonCount = 0;
        }

        if (laserCount++ >= 500 && laseLeft > 0) {
            canLaserShoot = true;
            laserCount = 0;
            document.getElementById("laser").className = "laser_use";
        }

        if (snowCount++ >= 500 && snowLeft > 0) {
            canSnowShoot = true;
            snowCount = 0;
            document.getElementById("snowflake").className = "snow_use";
        }

        if (bumbCount++ >= 500 && bumbLeft > 0) {
            canBumbShoot = true;
            bumbCount = 0;
            document.getElementById('lighting').className = "lighting_use";
        }
    }

    //背景移动
    this.moveBackground = function (type, controls) {
        switch (type) {
            case GAME.Constants.DIRECTION_LEFT_MOVE:
                controls.rotateLeft();
                if (GAME.SharedVar.left) {
                    controls.rotateLeft();
                }
                break;
            case GAME.Constants.DIRECTION_UP_MOVE:
                controls.rotateUp();
                if (GAME.SharedVar.up) {
                    controls.rotateUp();
                }
                break;
            case GAME.Constants.DIRECTION_RIGHT_MOVE:

                controls.rotateRight();
                if (GAME.SharedVar.right) {
                    controls.rotateRight();
                }
                break;
            case GAME.Constants.DIRECTION_DOWN_MOVE:
                controls.rotateDown();
                if (GAME.SharedVar.down) {
                    controls.rotateDown();
                }
                break;
            default :
                return;
        }
    }

    this.addLaserLeft = function () {
        laseLeft++;
        $('#laser_num').html(laseLeft);
        localStorage.setItem('laserLeft', laseLeft);
    }
    this.addSnowLeft = function () {
        snowLeft++;
        $('#snowflake_num').html(snowLeft);
        localStorage.setItem('snowLeft', snowLeft);
    }
    this.addBumbLeft = function () {
        bumbLeft++;
        $('#lighting_num').html(bumbLeft);
        localStorage.setItem('lightLeft', bumbLeft);
    }

    this.setLaserShoot = function (flag) {
        canLaserShoot = flag;
    }

    this.setSnowShoot = function (flag) {
        canSnowShoot = flag;
    }

    this.setBumbShoot = function (flag) {
        canBumbShoot = flag;
    }
}

GAME.operate = new GAME.Operate();

