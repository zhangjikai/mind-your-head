/**
 * 对象的缓冲池
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-7-30
 * Time: 上午10:19
 */
GAME.ObjectPool = GAME.ObjectPool || {}

/** 用来存放普通的子弹*/
GAME.ObjectPool.commonBullets = new Array();
/** 用来存放雪花粒子系统*/
GAME.ObjectPool.snowParticles = new Array();
/** 用来产生敌人爆炸时的效果*/
GAME.ObjectPool.bulletParticles = new Array();
/** 用来存放激光离子系统*/
GAME.ObjectPool.laserParticles = new Array();
/** 用来存放同时发射多个子弹的道具*/
GAME.ObjectPool.mulBullets = new Array();
/**炮弹*/
GAME.ObjectPool.otherBullets = new Array();
/** 用来存放敌人*/
GAME.ObjectPool.enemys = new Array();
/** 用来存放敌人的子弹*/
GAME.ObjectPool.enemyBullets = new Array();
/** 用来存放道具*/
GAME.ObjectPool.props = new Array();
/** 用来记录以上缓存数组的最大长度*/
GAME.ObjectPool.maxLength = 0;

/**music */
GAME.ObjectPool.backgroundAudio= new Audio("sounds/bgm1.ogg");

/**sound */
GAME.ObjectPool.explosionSoundPool=new GAME.MusicPool(10);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*-----------------------------------Music--------------------------------------*/
GAME.ObjectPool.initMusic=function(){
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = .25;
    this.backgroundAudio.load();
}

GAME.ObjectPool.initExplosionSound=function(){
    this.explosionSoundPool.init("explosion");
}

GAME.ObjectPool.getExplosionSound=function(){
    this.explosionSoundPool.get();
}




/*-----------------------------------普通子弹--------------------------------------*/
/** 寻找数组中第一个没有使用的子弹,并返回其地址，如果均在使用返回null*/
GAME.ObjectPool.getUnUsedCommonBullet = function () {
    var length = this.commonBullets.length;
    while (length--) {
        if (!this.commonBullets[length].isShow)
            return this.commonBullets[length];
    }
    return null;
}

/**
 * 如果缓存池中含有没有使用的子弹，返回缓存池中的子弹。
 * 如果缓存池中的子弹都在使用，返回一个新的子弹并将其加入池中
 */
GAME.ObjectPool.getCommonBullet = function () {
    var bullet = this.getUnUsedCommonBullet();
    if (bullet !== null && bullet !== undefined)
        return bullet;
    bullet = new GAME.CommonBullet({
        color: 0x63db31,
        speed:50
    });
    bullet.initCommonBullet();
    this.commonBullets.push(bullet);
    if (this.maxLength < this.commonBullets.length)
        this.maxLength = this.commonBullets.length;
    return bullet;
}

/**
 * 初始化普通子弹
 * @param num 子弹数量
 */
GAME.ObjectPool.initCommonBullets = function (num) {
    if (num == undefined || num == null)
        return;
    var bullet;
    while (num--) {
        bullet = new GAME.CommonBullet({});
        bullet.initCommonBullet();
        this.commonBullets.push(bullet);
    }
    if (this.maxLength < this.commonBullets.length)
        this.maxLength = this.commonBullets.length;
}

/*--------------------------------------雪花粒子系统-----------------------------------------*/
/**返回第一个没有使用的雪花粒子系统*/
GAME.ObjectPool.getUnUsedSnowParticle = function () {
    var length = this.snowParticles.length;
    while (length--) {
        if (this.snowParticles[length].type == GAME.Constants.SNOW_PARTICLE && !this.snowParticles[length].isShow)
            return this.snowParticles[length];
    }
    return null;
}

/** 返回缓存池中的雪花粒子系统*/
GAME.ObjectPool.getSnowParticle = function () {
    var particle = this.getUnUsedSnowParticle();
    if (particle !== null && particle !== undefined)
        return particle;
    particle = new GAME.SnowParticlele(100);
    particle.initSnow();
    particle.type = GAME.Constants.SNOW_PARTICLE;
    this.snowParticles.push(particle);
    if (this.maxLength < this.snowParticles.length)
        this.maxLength = this.snowParticles.length;
    return particle;
}

/** 初始化雪花粒子系统*/
GAME.ObjectPool.initSnowParticles = function (nums) {
    if (nums == undefined || nums == null)
        return;
    var particle;
    while (nums--) {
        particle = new GAME.SnowParticlele(100);
        particle.initSnow();
        particle.type = GAME.Constants.SNOW_PARTICLE;
        this.snowParticles.push(particle);
    }
    if (this.maxLength < this.snowParticles.length)
        this.maxLength = this.snowParticles.length;
}

/*--------------------------------------雪球-----------------------------------------*/
GAME.ObjectPool.getUnUsedSnowSphere = function () {
    var length = this.snowParticles.length;
    while (length--) {
        if (this.snowParticles[length].type == GAME.Constants.SNOW_SPHERE && !this.snowParticles[length].isShow)
            return this.snowParticles[length];
    }
    return null;
}

GAME.ObjectPool.getSnowSphere = function () {
    var sphere = this.getUnUsedSnowSphere();
    if (sphere !== null && sphere !== undefined)
        return sphere;
    sphere = new GAME.CommonBullet({
        radius: 30,
        image: 'images/ice.png'
    });
    sphere.initCommonBullet();
    sphere.type = GAME.Constants.SNOW_SPHERE;
    this.snowParticles.push(sphere);
    if (this.maxLength < this.snowParticles.length)
        this.maxLength = this.snowParticles.length;
    return sphere;
}

GAME.ObjectPool.initSnowSpheres = function (nums) {
    if (nums == undefined || nums == null)
        return;
    var sphere;
    while (nums--) {
        sphere = new GAME.CommonBullet({
            radius: 30,
            image: 'images/ice.png'
        });
        sphere.initCommonBullet();
        sphere.type = GAME.Constants.SNOW_SPHERE;
        this.snowParticles.push(sphere);
    }
    if (this.maxLength < this.snowParticles.length)
        this.maxLength = this.snowParticles.length;
}

/*---------------------------子弹击中怪物时的爆炸粒子效果-------------------------------*/
GAME.ObjectPool.getUnUsedBulletParticle = function () {
    var length = this.bulletParticles.length;
    while (length--) {
        if (!this.bulletParticles[length].isShow)
            return this.bulletParticles[length];
    }
    return null;
}

GAME.ObjectPool.getBulletParticle = function () {
    var particle = this.getUnUsedBulletParticle();
    console.log(this.bulletParticles.length);
    if (particle !== null && particle !== undefined)
        return particle;
    particle = new GAME.BulletParticle(100);
    particle.initBullet();
    this.bulletParticles.push(particle);
    if (this.maxLength < this.bulletParticles.length)
        this.maxLength = this.bulletParticles.length;
    return particle;
}

GAME.ObjectPool.initBulletParticles = function (nums) {
    if (nums == undefined || nums == null)
        return;
    var particle;
    while (nums--) {
        particle = new GAME.BulletParticle(100);
        particle.initBullet();
        this.bulletParticles.push(particle);
    }
    if (this.maxLength < this.bulletParticles.length)
        this.maxLength = this.bulletParticles.length;
}

GAME.ObjectPool.getUnUsedLaserParticle = function () {
    var length = this.laserParticles.length;
    while (length--) {
        if (!this.laserParticles[length].isShow)
            return this.laserParticles[length];
    }
    return null;
}

/*--------------------------------------激光粒子系统-----------------------------------------*/
GAME.ObjectPool.getLaserParticle = function () {
    var particle = this.getUnUsedLaserParticle();
    if (particle !== null && particle !== undefined)
        return particle;
    particle = new GAME.LaserParticle(40);
    particle.initLaser();
    this.laserParticles.push(particle);
    if (this.maxLength < this.laserParticles.length)
        this.maxLength = this.laserParticles.length;
    return particle;
}

GAME.ObjectPool.initLaserParticles = function (nums) {
    if (nums == undefined || nums == null)
        return;
    var particle;
    while (nums--) {
        particle = new GAME.LaserParticle(40, 100);
        particle.initLaser();
        this.laserParticles.push(particle);
    }
    if (this.maxLength < this.laserParticles.length)
        this.maxLength = this.laserParticles.length;
}

/*--------------------------------------普通敌人-------------------------------------*/
GAME.ObjectPool.getUnUsedCommonEnemy = function () {
    var length = this.enemys.length;
    while (length--) {
        if (!this.enemys[length].isShow && this.enemys[length].type == GAME.Constants.COMMON_ENEMY)
            return this.enemys[length];
    }
    return null;
}

GAME.ObjectPool.getCommonEnemy = function () {
    var enemy = this.getUnUsedCommonEnemy();

    if (enemy !== null && enemy !== undefined)
        return enemy;
    enemy = new GAME.CommonEnemy({
        radius:200,
        topImage: 'images/top6.jpg',
        headImage: 'images/111.jpg'
    });
    enemy.initEnemy();
    this.enemys.push(enemy);
    /*console.log(enemy.type);*/
    if (this.maxLength < this.enemys.length)
        this.maxLength = this.enemys.length;
    return enemy;
}

GAME.ObjectPool.initCommonEnemys = function (nums) {
    if (nums === undefined || nums === null)
        return;
    var enemy;
    while (nums--) {
        enemy = new GAME.CommonEnemy({
            radius: 200,
            topImage: 'images/grass.jpg',
            headImage: 'images/111.jpg'
        });
        enemy.initEnemy();
        this.enemys.push(enemy);
    }
    if (this.maxLength < this.enemys.length)
        this.maxLength = this.enemys.length;
}

/*--------------------------------------对手控制的敌人-------------------------------------*/
GAME.ObjectPool.getUnUsedRivalEnemy = function () {
    var length = this.enemys.length;
    while (length--) {
        if (!this.enemys[length].isShow && this.enemys[length].type == GAME.Constants.RIVAL_ENEMY)
            return this.enemys[length];
    }
    return null;
}

GAME.ObjectPool.getRivalEnemy = function () {
    var enemy = this.getUnUsedRivalEnemy();
   /* console.log(GAME.RivalEnemy.prototype === GAME.CommonEnemy.prototype);*/
    if (enemy !== null && enemy !== undefined)
        return enemy;
    enemy = new GAME.RivalEnemy({
        radius: 150,
        topImage: 'images/crate.png',
        headImage: 'images/111.jpg'
    });
    enemy.initEnemy();
    //这里和敌人之间碰撞检测有关，因为是从后往前检测，所以将对手控制的敌人放在第一个位置
    this.enemys.unshift(enemy);
  /*  console.log(this.enemys[0].type)*/
    if (this.maxLength < this.enemys.length)
        this.maxLength = this.enemys.length;
    return enemy;
}

GAME.ObjectPool.initRivalEnemys = function (nums) {
    if (nums === undefined || nums === null)
        return;
    var enemy;
    while (nums--) {
        enemy = new GAME.RivalEnemy({
            radius: 150,
            topImage: 'images/grass.jpg',
            headImage: 'images/111.jpg'
        });
        enemy.initEnemy();
        this.enemys.push(enemy);
    }
    if (this.maxLength < this.enemys.length)
        this.maxLength = this.enemys.length;
}

/*--------------------------------------敌人发射的子弹-----------------------------------------*/
GAME.ObjectPool.getUnUsedEnemyBullet = function () {
    var length = this.enemyBullets.length;
    while (length--) {
        if (!this.enemyBullets[length].isShow)
            return this.enemyBullets[length];
    }
    return null;
}

GAME.ObjectPool.getEnemyBullet = function () {
    var bullet = this.getUnUsedEnemyBullet();
    /*console.log(this.enemyBullets.length);*/
    if (bullet !== null && bullet !== undefined)
        return bullet;
    bullet = new GAME.EnemyBullet({
        radius: 30,
        color: 0xff0000
        /*color:0x000000*/
    });
    bullet.initEnemyBullet();

    this.enemyBullets.push(bullet);
    /* console.log("enemyBullets:", this.enemyBullets.length);*/
    if (this.maxLength < this.enemyBullets.length)
        this.maxLength = this.enemyBullets.length;
    return bullet;
}

GAME.ObjectPool.initEnemyBullets = function (nums) {
    if (nums == undefined || nums == null)
        return;
    var bullet;
    while (nums--) {
        bullet = new GAME.EnemyBullet({
            radius: 30,
            color: 0xff0000
        });
        bullet.initEnemyBullet();
        this.enemyBullets.push(bullet);
    }
    if (this.maxLength < this.enemyBullets.length)
        this.maxLength = this.enemyBullets.length;
}


/*--------------------------------------初始化道具-----------------------------------------*/
GAME.ObjectPool.getUnUsedProp = function (type) {
    var length = this.props.length;
    while (length--) {
        if (!this.props[length].isShow && this.props.type === type)
            return this.props[length];
    }
    return null;
}

GAME.ObjectPool.getProp = function (typeIndex) {
    var type;
    switch (typeIndex) {
        case 0:
            type = GAME.Constants.PROPS_HEART;
            break;
        case 1:
            type = GAME.Constants.PROPS_LASER;
            break;
        case 2:
            type = GAME.Constants.PROPS_SNOW;
            break;
        case 3:
            type = GAME.Constants.PROPS_BUMB;
            break;
        default :
            type = GAME.Constants.PROPS_HEART;
    }
    var prop = this.getUnUsedProp(type);
    /*console.log(this.enemyBullets.length);*/
    if (prop !== null && prop !== undefined)
        return prop;
    prop = new GAME.Props(type, 200);
    prop.initProps();

    this.props.push(prop);
    /* console.log("enemyBullets:", this.enemyBullets.length);*/
    if (this.maxLength < this.enemyBullets.length)
        this.maxLength = this.enemyBullets.length;
    return prop;

}

/*-----------------------------初始化多个子弹-----------------------------*/
GAME.ObjectPool.getUnusedMulBullets = function(){
    var length = this.mulBullets.length;
    while(length--) {
        if(!this.mulBullets[length].isShow()){
            return this.mulBullets[length];
        }
    }
    return null;
}

GAME.ObjectPool.getMulBullets = function() {
    var mulBullet = this.getUnusedMulBullets();
    if(mulBullet != null) {
        return mulBullet;
    }
    mulBullet = new GAME.MulBullets(20, 30);
    mulBullet.initMulBulltes();
    this.mulBullets.push(mulBullet);
    if (this.maxLength < this.mulBullets.length)
        this.maxLength = this.mulBullets.length;
    return mulBullet;
}


/*----------------------------初始化炮弹--------------------------*/
GAME.ObjectPool.getUnusedOtherBullet = function() {
    var length = this.otherBullets.length;;
    while(length--) {
        if(!this.otherBullets[length].isShow) {
            return this.otherBullets[length];
        }
    }
    return null;
}

GAME.ObjectPool.getOtherBullet = function() {
    var otherBullet = this.getUnusedOtherBullet();
    if(otherBullet != null) {
        return otherBullet;
    }
    otherBullet = new GAME.OtherBullet({
        radius:100,
        speed:20,
        color: 0xffff00
    });
    otherBullet.initOtherBullet();
    this.otherBullets.push(otherBullet);
    if (this.maxLength < this.otherBullets.length)
        this.maxLength = this.otherBullets.length;
    return otherBullet;
}