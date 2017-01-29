/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-8-27
 * Time: 上午10:12
 */
function Flare(h, s, l) {
    this.h = h || 0.08;
    this.s = s || 0.8;
    this.l = l || 0.8;
    this.scene = null;
    this.appearTime = 0;
    this.flare = null;
    this.isShow = false;
}

Flare.prototype = {
    constructor: Flare,
    texture0: THREE.ImageUtils.loadTexture("images/02.png"),
    texture1: THREE.ImageUtils.loadTexture("images/lensflare2.png"),
    initFlare: function () {
        var flareColor = new THREE.Color(0xffffff);
        flareColor.setHSL(this.h, this.s, this.l + 0.5);
        this.flare = new THREE.LensFlare(this.texture0, 100, 0.0, THREE.AdditiveBlending, flareColor);
        /*lensFlare.add(this.texture1, 200, 0.0, THREE.AdditiveBlending);
         lensFlare.add(this.texture1, 200, 0.0, THREE.AdditiveBlending);
         lensFlare.add(this.texture1, 200, 0.0, THREE.AdditiveBlending);*/
    },

    updateFlare: function () {
        if (!this.isShow)
            return;
        this.appearTime++;
        if (this.appearTime <= 10) {
            var lensFlares = this.flare.lensFlares;
            var length = lensFlares.length;
            var size = lensFlares[0].size/10;
            while (length--) {
                lensFlares[length].size += size;
            }
            return;
        }
        if(this.appearTime>=70) {
            var lensFlares = this.flare.lensFlares;
            var length = lensFlares.length;
            while (length--) {
                lensFlares[length].opacity -= 0.05;
            }
            if(lensFlares >= 90) {
                this.isShow = false;
                this.appearTime = 0;
                length = lensFlares.length;
                while(length--) {
                    lensFlares[length].opacity = 1;
                }
                this.scene.remove(this.flare);
            }
        }
    },

    beginFlare:function(mesh, scene) {
        this.isShow = true;
        this.flare.position.copy(mesh.position);
        this.scene = scene;
        this.scene.add(this.flare);
    }
}