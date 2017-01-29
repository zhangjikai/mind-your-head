/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-8
 * Time: 下午3:34
 */

GAME.Props = function (type, size) {
    this.type = type || GAME.Constants.PROPS_HEART;
    this.size = size || 100;
    this.isShow = false;
    this.showTime = 1000;
    this.showCount = 0;
    this.scene = null;
    this.rotateCount = 0;
    this.mesh = null;
}

GAME.Props.prototype = {
    constructor:GAME.Props,

    initProps: function () {
        var texture = THREE.ImageUtils.loadTexture(this.type);
        var material = new THREE.MeshBasicMaterial({
            map:texture
        });
        var geometry = new THREE.CubeGeometry(this.size, this.size, this.size);
        this.mesh = new THREE.Mesh(geometry, material);
    },

    updateProps:function() {
        if(!this.isShow) {
            return;
        }
        this.showCount++;
        if(this.showCount >= this.showTime) {
            this.showCount = 0;
            this.isShow = false;
            this.scene.remove(this.mesh);
            return;
        }
        this.rotateCount+=0.01;
        if(this.rotateCount>=6.28) {
            this.rotateCount = 0;
        }
        this.mesh.rotation.y = this.rotateCount;

    },

    removeProps:function() {
        this.isShow = false;
        this.scene.remove(this.mesh);
    },

    beginProps:function(position, scene) {
        this.scene = scene;
        this.mesh.position.copy(position);
        this.mesh.position.y += 300;
        this.isShow = true;
        this.scene.add(this.mesh);
    }
}

