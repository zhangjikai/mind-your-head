/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-8-27
 * Time: 上午8:21
 */
GAME.LaserParticle = function(particleNums, showTime) {
    this.particleNums = particleNums || 40;
    this.particleSystem = null;
    this.scene = null;
    this.appearTime = 0;
    this.showTime = showTime || 300;
    this.isShow = false;
    this.isMove = true;
}

GAME.LaserParticle.prototype = {
    constructor: GAME.LaserParticle,
    texture: THREE.ImageUtils.loadTexture("images/02.jpg"),
    initLaser: function () {
        var attributes = {
            size: { type: 'f', value: [] },
            pcolor: { type: 'c', value: [] }
        };
        var uniforms = {
            texture: { type: "t", value: this.texture }
        };
        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            attributes: attributes,
            vertexShader: document.getElementById('vertexLaser').textContent,
            fragmentShader: document.getElementById('fragmentLaser').textContent,
            blending: THREE.AdditiveBlending,
            depthWrite: true,
            transparent: true
        });
        var particles = new THREE.Geometry();
        var pNums = this.particleNums;
        while (pNums--) {
            var particle = new THREE.Vertex(new THREE.Vector3(0, 0, 0));
            particles.vertices.push(particle);
        }
        this.particleSystem = new THREE.ParticleSystem(particles, shaderMaterial);
        var vertices = this.particleSystem.geometry.vertices;
        var values_size = attributes.size.value;
        var values_color = attributes.pcolor.value;
        var v = vertices.length;
        var color = new THREE.Color(0xffffff);
        while (v--) {
            values_size[v] = 200 + v * 8;
            /*values_size[v] = 200;*/
            values_color[ v ] = color;
            values_color[ v ].setHSL(v / vertices.length, 0.1, 0.6)
        }
        this.particleSystem.sortParticles = true;
    },

    updateLaser: function (vector) {
        if (!this.isShow) {
            return;
        }
        this.appearTime++;
        if(this.appearTime > this.showTime) {
            var sub = this.particleNums - (this.appearTime - this.showTime);
            if(sub >= 0 ) {
                this.particleSystem.geometry.vertices[sub].set(10000, 10000, 1000);
                while(sub--) {
                    var pX = (vector.x * 90 ) * sub + vector.x * 300;
                    var pY = (vector.y * 90 + 20) * sub + vector.y * 300;
                    var pZ = vector.z * 90 * sub + vector.z * 300;
                    this.particleSystem.geometry.vertices[sub].set(pX, pY, pZ);
                }
                return;
            }
            this.isShow = false;
            this.appearTime = 0;
            this.scene.remove(this.particleSystem);
            return;
        }
        if (this.appearTime <= 40) {
            var time = this.appearTime;
            while (time--) {
                var pX = (vector.x * 90) * time + vector.x * 300;
                var pY = (vector.y * 90 + 20) * time + vector.y * 300;
                var pZ = vector.z * 90 * time + vector.z * 300;
                this.particleSystem.geometry.vertices[time].set(pX, pY, pZ);
            }
        } else {
            var pNums = this.particleNums;
            while (pNums--) {
                var pX = (vector.x * 90 ) * pNums + vector.x * 300;
                var pY = (vector.y * 90 + 20) * pNums + vector.y * 300;
                var pZ = vector.z * 90 * pNums + vector.z * 300;
                this.particleSystem.geometry.vertices[pNums].set(pX, pY, pZ);
            }
        }
    },

    beginLaser:function(scene) {
        var pNums = this.particleNums;
        while(pNums--) {
            this.particleSystem.geometry.vertices[pNums].set(10000,10000,10000);
        }
        this.scene = scene;
        this.isShow = true;
        this.scene.add(this.particleSystem);
    }
}