/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-1
 * Time: 下午6:35
 */
GAME.EnemyBullet = function (parameters) {
    GAME.Bullet.call(this);
    this.minDis = 0;
    this.setValues(parameters);
}

GAME.EnemyBullet.prototype = Object.create(GAME.Bullet.prototype);

GAME.EnemyBullet.prototype.initEnemyBullet = function () {
    var geometry = this.getGeometry(this.radius, this.image);
    var material = this.getMaterial(this.color, this.image);
    this.mesh = new THREE.Mesh(geometry, material);
}

GAME.EnemyBullet.prototype.updateEnemyBullet = function () {
    if (!this.isShow) {
        return;
    }
    this.mesh.position.add(this.moveVector);
    if (this.checkBounds()) {
        this.removeEnemyBullet();
        return;
    }
    if (Math.abs(this.mesh.position.z) < this.minDis) {
        console.log("minDis", this.minDis);
        this.removeEnemyBullet();
        if (this.bulletType == GAME.Constants.RIVAL_ENEMY_BULLET)
            return;
        var vector = GAME.Helper.transWorld2Screen(this.mesh, this.camera);
        var dis = Math.sqrt(
            (window.innerWidth / 2 - vector.x) * (window.innerWidth / 2 - vector.x)
                + (window.innerHeight / 2 - vector.y) * (window.innerHeight / 2 - vector.y)
        );
        if (dis < 50) {
            console.log('被敌人被击中了');
            var text = '#heart' + GAME.SharedVar.lifeSpare;
            $(text).css({
                display: 'none'
            });
            if (GAME.SharedVar.gameMode == GAME.Constants.FIGHT_MODE) {
                GAME.Server.sendMessage(GAME.Protocol.TRANSMIT_DATA + GAME.Protocol.HIT_BY_ENEMY);
            }
            GAME.SharedVar.lifeSpare--;
            GAME.gameStart.setLostCount(0);
            GAME.Helper.rangeShowCount = 0;
			GAME.Sound.playGruntSound();
        }
    }
}

GAME.EnemyBullet.prototype.removeEnemyBullet = function () {
    this.isShow = false;
    this.scene.remove(this.mesh);
    /* if (this.bulletType == GAME.Constants.RIVAL_ENEMY_BULLET)
     GAME.Server.sendMessage(GAME.Protocol.TRANSMIT_DATA + GAME.Protocol.REMOVE_RIVAL_BULLET + this.id);*/
}

GAME.EnemyBullet.prototype.beginEnemyBullet = function (vector, position, camera, scene) {
    this.isShow = true;
    this.scene = scene;
    this.camera = camera;
    this.mesh.position.copy(position);
    this.mesh.position.y -= 150;
    this.minDis = Math.abs(vector.z * 300);
    vector.set(
        -(position.x - vector.x * 300) / 1000,
        -(position.y - 150 - vector.y * 300) / 1000,
        -(position.z - vector.z * 300) / 1000
    )

    this.bulletType = GAME.Constants.COMMON_ENEMY_BULLET;
    this.moveVector.set(vector.x * this.speed, vector.y * this.speed, vector.z * this.speed);
    this.scene.add(this.mesh);
}

GAME.EnemyBullet.prototype.beginFightBullet = function (msg, position, camera, scene) {
    this.isShow = true;
    this.scene = scene;
    this.camera = camera;
    this.mesh.position.set(position.x * 1.09, position.y * 1.09, position.z * 1.09);
    this.minDis = Math.abs(msg.vector.z * 500);
    /*vector.set(
     (position.x - vector.x * 300) / 1000,
     (position.y - vector.y * 300) / 1000,
     (position.z - vector.z * 300) / 1000
     )*/
    this.id = msg.id;
    this.bulletType = GAME.Constants.RIVAL_ENEMY_BULLET;
    this.speed = msg.speed || this.speed;
    this.moveVector.set(msg.vector.x * this.speed, msg.vector.y * this.speed, msg.vector.z * this.speed);
    /*console.log(this.speed);*/
    this.scene.add(this.mesh);
}
