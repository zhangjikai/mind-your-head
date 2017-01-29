/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-11-9
 * Time: 下午2:27
 * To change this template use File | Settings | File Templates.
 */
GAME.OtherBullet = function (parameters) {
    GAME.Bullet.call(this);
    this.emissive = null;
    this.setValues(parameters);
}

GAME.OtherBullet.prototype = Object.create(GAME.Bullet.prototype);

GAME.OtherBullet.prototype.getGeometry = function (radius) {
    var markText = "OtherBulletGeometry:" + radius;
    var length = this.sharedObjs.length;
    while (length--) {
        if (this.sharedObjs[length].markText == markText) {
            return this.sharedObjs[length];
        }
    }
    var geometry = new THREE.IcosahedronGeometry(radius, 0);
    geometry.markText = markText;
    this.sharedObjs.push(geometry);
    return geometry;
}

GAME.OtherBullet.prototype.getMaterial = function (color, emissive) {
    color = color || 0xffff00;
    emissive = emissive || 0x333333 ;
    var markText = "OtherBulletMaterial:" + color + "<>" + emissive;
    var length = this.sharedObjs.length;
    while (length--) {
        if (this.sharedObjs[length].markText == markText) {
            return this.sharedObjs[length];
        }
    }
    var material = new THREE.MeshLambertMaterial({
        color: color,
        emissive: emissive,
        shading: THREE.FlatShading
    })
    material.markText = markText;
    this.sharedObjs.push(material);
    return material;
}

GAME.OtherBullet.prototype.initOtherBullet = function () {
    var geometry = this.getGeometry(this.radius);
    var material = this.getMaterial(this.color, this.emissive);
    this.mesh = new THREE.Mesh(geometry, material);
}

GAME.OtherBullet.prototype.updateOtherBullet = function () {
    if (!this.isShow) {
        return;
    }
    this.mesh.position.add(this.moveVector);
    this.mesh.rotation.x -= 0.1;
    if (this.checkBounds()) {
        this.removeOtherBullet();
    }
}

GAME.OtherBullet.prototype.removeOtherBullet = function () {
    this.isShow = false;
    this.scene.remove(this.mesh);
}

GAME.OtherBullet.prototype.beginOtherBullet = function (vector, camera, scene) {
    this.isShow = true;
    this.camera = camera;
    this.scene = scene;
    this.mesh.position.set(vector.x * 300, vector.y * 300, vector.z * 300);
    this.moveVector.set(vector.x * this.speed, vector.y * this.speed, vector.z * this.speed);
    this.scene.add(this.mesh);
}

GAME.OtherBullet.prototype.beginOtherBulletBumb = function (position, camera, scene) {
    this.isShow = true;
    this.camera = camera;
    this.scene = scene;
    this.mesh.position.copy(position);
    this.moveVector.set(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
    this.scene.add(this.mesh);
}

