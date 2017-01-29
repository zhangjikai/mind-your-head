/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-1
 * Time: 下午8:33
 */
GAME.RivalEnemy = function (parameters) {
    GAME.Enemy.call(this);
    this.setValues(parameters);
}

GAME.RivalEnemy.prototype = Object.create(GAME.Enemy.prototype);

GAME.RivalEnemy.prototype.type = GAME.Constants.RIVAL_ENEMY;

GAME.RivalEnemy.prototype.setPosition = function (position) {
    if (position !== undefined) {
        this.mesh.position.set(position.x * 4.5, position.y * 4.5, position.z * 4.5);
    }
    this.mesh1.position.set(this.mesh.position.x, this.mesh.position.y + this.radius * 1.2, this.mesh.position.z);
    this.mesh2.position.set(this.mesh.position.x, this.mesh.position.y + this.radius * 1.4, this.mesh.position.z);
    this.mesh3.position.set(this.mesh.position.x, this.mesh.position.y + this.radius * 1.4, this.mesh.position.z);
}

GAME.RivalEnemy.prototype.updateRivalEnemy = function (vector) {
    if (!this.isShow)
        return;
    this.lookVector.set(vector.x, this.mesh.position.y, vector.z);
    this.mesh.lookAt(this.lookVector);
    this.rotateTop();
}

GAME.RivalEnemy.prototype.beginRivalEnemy = function (camera, scene) {
    this.scene = scene;
    this.camera = camera;
    this.isShow = true;
   /* this.mesh.material.opacity = 0;
    this.mesh1.material.opacity = 0;*/

    this.mesh.position.set(0, 0, 500 * 5);
    this.setPosition();
    this.scene.add(this.mesh);
    this.scene.add(this.mesh1);
    this.scene.add(this.mesh2);
    this.scene.add(this.mesh3);
    this.mesh.updateMatrixWorld(true);
}