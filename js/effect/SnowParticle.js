/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-8-26
 * Time: 下午4:26
 */
GAME.SnowParticlele = function(particleNums) {
    this.particleNums = particleNums || 50;
    this.uniforms = null;
    this.particleSystem = null;
    this.isShow = false;
    this.opacityInc = true;
    this.scene = null;
}

GAME.SnowParticlele.prototype = {
    constructor: GAME.SnowParticlele,
    texture: THREE.ImageUtils.loadTexture("images/snowflake2.png"),
    initSnow: function () {
        var attributes = {
            size: { type: 'f', value: [] },
            pcolor: { type: 'c', value: [] }
        };

        this.uniforms = {
            amplitude: { type: "f", value: 5.0 },
            opacity: {type: "f", value: 0.3},
            texture: { type: "t", value: this.texture },
            color: { type: "c", value: new THREE.Color(0x00ff00) }
        };
        var material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            attributes: attributes,
            vertexShader: document.getElementById('vertexsnow').textContent,
            fragmentShader: document.getElementById('fragmentsnow').textContent,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        var geometry = new THREE.Geometry();
        var pNums = this.particleNums;
        while (pNums--) {
            geometry.vertices[pNums] = new THREE.Vector3();
            geometry.vertices[pNums].velocity = new THREE.Vector3();
        }
        this.particleSystem = new THREE.ParticleSystem(geometry, material);
        var vertices = geometry.vertices;
        var values_size = attributes.size.value;
        var values_color = attributes.pcolor.value;
        var v = vertices.length;
        while (v--) {
            values_size[v] = 350;
            values_color[ v ] = new THREE.Color(0x0000ff);
            values_color[ v ].setHSL(v / vertices.length, 0.2, 0.8);
        }
        this.particleSystem.sortParticles = true;
    },

    updateSnow: function () {
        if (!this.isShow)
            return;
        var pCount = this.particleNums;
        while (pCount--) {
            var particle = this.particleSystem.geometry.vertices[pCount];
            particle.add(particle.velocity);
        }
        if (this.opacityInc) {
            this.uniforms.opacity.value += 0.02;
            if (this.uniforms.opacity.value >= 1) {
                this.opacityInc = false;
            }
        } else {
            this.uniforms.opacity.value -= 0.003;
            if (this.uniforms.opacity.value <= 0) {
                this.isShow = false;
                this.scene.remove(this.particleSystem);
            }
        }
        var time = Date.now() * 0.001;
        this.uniforms.amplitude.value = 0.5 * Math.sin(0.5 * time);
        this.uniforms.color.value.offsetHSL(0.0005, 0, 0);
    },

    beginSnow: function (target, scene) {
        var pNums = this.particleNums;
        while (pNums--) {
            this.particleSystem.geometry.vertices[pNums].copy(target);
            this.particleSystem.geometry.vertices[pNums].velocity.set(
                (Math.random() * 4 - 2) *1.3,
                (Math.random() * 4 - 2),
                (Math.random() * 4 - 2)
            );
        }
        this.isShow = true;
        this.uniforms.opacity.value = 0.3;
        this.opacityInc = true;
        this.scene = scene;
        this.scene.add(this.particleSystem);
    }
}