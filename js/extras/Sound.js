/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-11-18
 * Time: 下午10:21
 * To change this template use File | Settings | File Templates.
 */
GAME.Sound = {
    bgm: null,
    shootm: null,
    hitm: null,
    canMusic: null,
    canSound: null,
    laserm: null,
    icem: null,
    gruntm:null,
    successm:null,
    ovrem:null,
    initMusic: function () {
        GAME.ObjectPool.initMusic();
        GAME.ObjectPool.initExplosionSound();
        this.bgm = document.getElementById('bgm');
        this.hitm = document.getElementById('hitm');
        this.shootm = document.getElementById('shootm');
        this.laserm = document.getElementById('laserm');
        this.icem = document.getElementById('icem');
        this.gruntm = document.getElementById('gruntm');
        this.successm = document.getElementById('successm');
        this.overm = document.getElementById('overm');
        this.canMusic = parseInt(localStorage.getItem('music'));
        this.canSound = parseInt(localStorage.getItem('sound'));
    },
    playBgMusic: function () {
        if (this.canMusic) {
            this.bgm.play();
        }
    },
    stopBgMusic: function () {
        this.bgm.currentTime = 0;
        this.bgm.pause();
    },
    playHitSound: function () {
        if (this.canSound) {
            this.hitm.play();
        }
    },
    playShootSound: function () {
        if (this.canSound) {
            this.shootm.play();
        }
    },
    playLaserSound: function () {
        if(this.canSound) {
            this.laserm.play();
        }
    },
    playIceSound: function () {
        if (this.canSound) {
            this.icem.play();
        }
    },
    playGruntSound:function() {
        if(this.canSound) {
            this.gruntm.play();
        }
    },
    playSucSound:function() {
        if(this.canSound) {
            this.successm.play();
        }
    },

    stopSucSound:function() {
        if(this.canSound) {
            this.successm.currentTime = 0;
            this.successm.pause();
        }
    },
    playOverSound:function() {
        if(this.canSound) {
            this.overm.play();
        }
    },

    stopOverSound:function() {
        if(this.canSound) {
            this.overm.currentTime = 0;
            this.overm.pause();
        }
    }
}