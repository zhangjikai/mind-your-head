/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-8
 * Time: 下午4:39
 */
GAME.BumbParticle = function(particleNums) {
    this.particleNums = particleNums || 50;
    this.particleSystem = null;
    this.scene = null;
    this.isShow = false;
    this.showTime = 0;
}

GAME.BumbParticle.prototype = {
    constructor:GAME.BumbParticle,

    initBumb:function() {
        var geometry = new THREE.Geometry();
        var pNums = this.particleNums;
        while (pNums--) {
            geometry.vertices[pNums] = new THREE.Vector3();
            geometry.vertices[pNums].velocity = new THREE.Vector3();
        }
        var material = new THREE.ParticleBasicMaterial({
            color: 0x000000,
            blending: THREE.AdditiveBlending,
            size: 30,
            transparent: true,
            depthTest: true
        });
        this.particleSystem = new THREE.ParticleSystem(geometry, material);
        this.particleSystem.sortParticles = true;
    },

    updateBumb:function() {
        if (!this.isShow)
            return;
        this.showTime++;
        if (this.showTime <= 70) {
            var pNums = this.particleNums;
            var particle;
            while (pNums--) {
                particle = this.particleSystem.geometry.vertices[pNums];
                particle.add(particle.velocity);
            }
            this.particleSystem.rotation.y += 0.03;
            if(this.showTime >= 50) {
                this.particleSystem.material.opacity -= 0.05;
            }
        } else {
            this.isShow = false;
            this.showTime = 0;
            this.scene.remove(this.particleSystem);
        }
    },

    beginBumb:function(mesh,scene) {
        var pNums = mesh.geometry.vertices.length;
        if(pNums > this.particleNums)
            this.particleNums = pNums;
        while (pNums--) {
            if (this.particleSystem.geometry.vertices[pNums] == null
                || this.particleSystem.geometry.vertices[pNums] == undefined){
                this.particleSystem.geometry.vertices[pNums] = new THREE.Vector3(0, 0, 0);
                this.particleSystem.geometry.vertices[pNums].velocity = new THREE.Vector3(0, 0, 0);
            }

            var particle = this.particleSystem.geometry.vertices[pNums];
            particle.copy(mesh.geometry.vertices[pNums]);
            particle.velocity.set(
                (Math.random() * 4 - 2)*2,
                (Math.random() * 4 - 2)*2,
                (Math.random() * 4 - 2)*2
            );
        }
        this.particleSystem.position.copy(mesh.position);
        this.scene = scene;
        this.isShow = true;
        this.particleSystem.material.opacity = 1;
        this.scene.add(this.particleSystem);
    }
}