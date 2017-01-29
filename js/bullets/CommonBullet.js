/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-1
 * Time: 下午4:46
 */
GAME.CommonBullet = function (parameters) {
    GAME.Bullet.call(this);
    this.cubeMesh = null;
    this.setValues(parameters);
}

GAME.CommonBullet.prototype = Object.create(GAME.Bullet.prototype);

GAME.CommonBullet.prototype.cubeMeshMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0
});

GAME.CommonBullet.prototype.initCommonBullet = function() {
    var geometry = this.getGeometry(this.radius, this.image);
    var material = this.getMaterial(this.color, this.image);
    this.cubeMesh = new THREE.Mesh(
        this.getCubeGeometry(this.radius * 2, this.radius * 2, this.radius * 2),
        this.cubeMeshMaterial
    );
    this.mesh = new THREE.Mesh(geometry, material);
    this.cubeMesh.position = this.mesh.position;
}

GAME.CommonBullet.prototype.updateCommonBullet = function() {
    if (!this.isShow) {
        return;
    }
    this.mesh.position.add(this.moveVector);
    if (this.checkBounds()) {
        this.removeCommonBullet();
    }
}

GAME.CommonBullet.prototype.removeCommonBullet = function() {
    this.isShow = false;
    var p = this.mesh.position;
	$('#msg1').html('x:' + parseInt(p.x) + ' y:' + parseInt(p.y) + 'z' + parseInt(p.z));
    if(GAME.SharedVar.gameMode == GAME.Constants.FIGHT_MODE) {
        GAME.Server.sendMessage(GAME.Protocol.TRANSMIT_DATA+GAME.Protocol.REMOVE_COMMON_BULLET+this.id);
    }
    this.scene.remove(this.cubeMesh);
    this.scene.remove(this.mesh);
}

GAME.CommonBullet.prototype.beginCommonBullet = function(vector, camera, scene) {
    this.isShow = true;
    this.camera = camera;
    this.scene = scene;
    this.mesh.position.set(vector.x * 300, vector.y * 300, vector.z * 300);
    this.moveVector.set(vector.x * this.speed, vector.y * this.speed, vector.z * this.speed);
    this.scene.add(this.mesh);
}
