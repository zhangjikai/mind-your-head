/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-1
 * Time: 下午1:05
 */
GAME.CommonEnemy = function (parameters) {
    GAME.Enemy.call(this);
    this.moveVector = new THREE.Vector3;
    this.shootCount = parseInt(Math.random() * 200);
    this.faceIndex = GAME.Constants.FACE_COMMON;
    this.shootTime = 200;
    this.hitCount = 0;
    this.eBulletSpeed = 5;
    this.isSnow = false;
    this.snowCount = 0;
    this.snowTime = 400;
    this.meshArray = [];
    this.setValues(parameters);
}

GAME.CommonEnemy.prototype = Object.create(GAME.Enemy.prototype);

GAME.CommonEnemy.prototype.type = GAME.Constants.COMMON_ENEMY;
GAME.CommonEnemy.prototype.maxLength = 2200;
GAME.CommonEnemy.prototype.minLength = 500;
GAME.CommonEnemy.prototype.faceIndexAll = GAME.Constants.FACE_COMMON;

GAME.CommonEnemy.prototype.genRaodomPos = function () {
    var max = this.maxLength - this.radius / 2;
    var min = this.minLength + this.radius / 2;
    var i = max - min;
    var x1 = Math.random() * i * 2 - i;
    var y1 = Math.random() * i * 2 - i;
    var z1 = Math.random() * i * 2 - i;
    x1 = x1 > 0 ? x1 + min : x1 - min;
    y1 = y1 > 0 ? y1 + min : y1 - min;
    z1 = z1 > 0 ? z1 + min : z1 - min;
    this.mesh.position.set(x1, y1, z1);
}

GAME.CommonEnemy.prototype.checkPosition = function (enemys) {
    var len = enemys.length;
    while (len--) {
        if (enemys[len].isShow && GAME.Helper.checkCollision(this.mesh, enemys[len].mesh) && this !== enemys[len]) {
            return true;
        }
    }
    return false;
}

GAME.CommonEnemy.prototype.initPosiotn = function () {
    this.mesh1.position.set(this.mesh.position.x, this.mesh.position.y + this.radius * 1.2, this.mesh.position.z);
    this.mesh2.position.set(this.mesh.position.x, this.mesh.position.y + this.radius * 1.4, this.mesh.position.z);
    this.mesh3.position.set(this.mesh.position.x, this.mesh.position.y + this.radius * 1.4, this.mesh.position.z);
}

GAME.CommonEnemy.prototype.updateCommonEnemy = function (vector) {
    if (!this.isShow) {
        return;
    }
    if (this.isSnow) {
        this.snowCount++;
        if (this.snowCount < this.snowTime) {
            return;
        }
        this.snowCount = 0;
        this.isSnow = false;
    }
    /* if (this.mesh.material.opacity < 1) {
     this.mesh.material.opacity += 1;
     this.mesh1.material.opacity += 1;
     return;
     }*/
    /* return;*/
    this.rotateTop();
    this.mesh.position.add(this.moveVector);
    this.mesh1.position.add(this.moveVector);
    this.mesh2.position.add(this.moveVector);
    this.mesh3.position.add(this.moveVector);
    this.lookVector.set(vector.x, this.mesh.position.y, vector.z);
    this.mesh.lookAt(this.lookVector);
    this.shootCount++;
    if (this.shootCount == 50) {
        this.mesh.material = this.getHeadMaterial(GAME.Constants.FACE_COMMON);
    }
    if (this.shootCount == this.shootTime - 20) {
        this.mesh.material = this.getHeadMaterial(GAME.Constants.FACE_OPEN_MOUSE);
    }
    if (this.shootCount >= this.shootTime) {
        this.shootCount = 0;
        if (GAME.Helper.checkInView(this.camera, this.mesh)) {
            this.enemyShoot(vector);
        }
    }

    var type = this.checkBounds();
    switch (type) {
        case GAME.Constants.X_OUT_BOUNDS:
            this.moveVector.set(
                -this.moveVector.x,
                (Math.random() * 4 - 2) * this.speed,
                (Math.random() * 4 - 2) * this.speed);
            this.caclTopRotateSpeed();
            break;
        case GAME.Constants.Y_OUT_BOUNDS:
            this.moveVector.set(
                //(Math.random() * 2 - 1) * this.speed,
                (Math.random() * 4 - 2) * this.speed ,
                -this.moveVector.y,
                (Math.random() * 4 - 2) * this.speed
            );
            this.caclTopRotateSpeed();
            break;
        case GAME.Constants.Z_OUT_BOUNDS:
            this.moveVector.set(
                (Math.random() * 4 - 2) * this.speed,
                (Math.random() * 4 - 2) * this.speed ,
                -this.moveVector.z);
            this.caclTopRotateSpeed();
            break;
        case GAME.Constants.MIN_OUT_BOUNDS:
            this.reverseMoveVector();
    }
}

GAME.CommonEnemy.prototype.reverseMoveVector = function () {
    this.moveVector.set(-this.moveVector.x, -this.moveVector.y, -this.moveVector.z);
}

GAME.CommonEnemy.prototype.checkBounds = function () {
    var p = this.mesh.position;
    var max = this.maxLength - this.radius / 2;
    var min = this.minLength + this.radius / 2;
    if (Math.abs(p.x) >= max) {
        return GAME.Constants.X_OUT_BOUNDS;
    }
    if (Math.abs(p.y) >= max) {
        return GAME.Constants.Y_OUT_BOUNDS;
    }
    if (Math.abs(p.z) >= max) {
        return GAME.Constants.Z_OUT_BOUNDS;
    }
    if (Math.abs(p.x) <= min && Math.abs(p.y) <= min && Math.abs(p.z) <= min) {
        return GAME.Constants.MIN_OUT_BOUNDS;
    }
    return GAME.Constants.NO_OUT_BOUNDS;
}

GAME.CommonEnemy.prototype.enemyShoot = function (vector) {
    var position = this.mesh.position;
    var bullet = GAME.ObjectPool.getEnemyBullet();
    bullet.speed = this.eBulletSpeed;
    bullet.beginEnemyBullet(vector, position, this.camera, this.scene);
}

GAME.CommonEnemy.prototype.caclTopRotateSpeed = function () {
    this.topRotateSpeed = Math.sqrt(
        this.moveVector.x * this.moveVector.x +
            this.moveVector.y * this.moveVector.y +
            this.moveVector.z * this.moveVector.z
    ) / 50;
    /*this.topRotateSpeed = 0.2;*/
    if (this.topRotateSpeed < 0.15) {
        this.topRotateSpeed = 0.15;
    }
    /* console.log(this.topRotateSpeed);*/
}

GAME.CommonEnemy.prototype.changeMesh = function (vector,type) {
    //var geometry = this.getHeadGeometry(this.radius, 20, 15, type);
    var markText = "mesh:" + type;
    var length = this.meshArray.length;
    //console.log(length);
    while (length--) {
        if (this.meshArray[length].markText == markText) {
            if (this.meshArray[length] == this.mesh)
                return;
            this.meshArray[length].material = this.mesh.material;
            this.meshArray[length].position.copy(this.mesh.position);
            this.scene.remove(this.mesh);
            this.scene.add(this.meshArray[length]);
            this.mesh = this.meshArray[length];
            this.lookVector.set(vector.x, this.mesh.position.y, vector.z);
            this.mesh.lookAt(this.lookVector);
            return;
        }
    }
    var geometry = this.getHeadGeometry(this.radius, 20, 15, type);
    var mesh = new THREE.Mesh(geometry, this.mesh.material);
    mesh.position.copy(this.mesh.position);
    mesh.markText = markText;
    this.scene.add(mesh);
    this.scene.remove(this.mesh);
    this.mesh = mesh;
    this.lookVector.set(vector.x, this.mesh.position.y, vector.z);
    this.mesh.lookAt(this.lookVector);
    this.meshArray.push(mesh);
}

GAME.CommonEnemy.prototype.beginCommonEnemy = function (enemys, camera, scene) {
    this.scene = scene;
    this.camera = camera;
    this.isShow = true;
    this.changeMesh(GAME.Constants.FACE_COMMON);
    GAME.CommonEnemy.prototype.faceIndexAll++;
    /*   this.faceIndexAll = this.faceIndexAll + 1;*/
    //console.log(this);
    //console.log(this.faceIndexAll);
    if (this.faceIndexAll > GAME.Constants.FACE_SIZE_SMALL) {
        GAME.CommonEnemy.prototype.faceIndexAll = GAME.Constants.FACE_EYE_BROW_UP;
    }
    this.faceIndex = this.faceIndexAll;

    /*this.mesh.material.opacity = 0;
     this.mesh1.material.opacity = 0;*/
    this.genRaodomPos();
    while (this.checkPosition(enemys)) {
        this.genRaodomPos();
    }
    /*  this.mesh.position.set(100, 100, -2000);*/
    this.initPosiotn();
    this.moveVector.set(
        (Math.random() * 4 - 2) * this.speed,
        (Math.random() * 4 - 2) * this.speed,
        (Math.random() * 4 - 2) * this.speed
    );
    this.caclTopRotateSpeed();
    this.scene.add(this.mesh);
    this.scene.add(this.mesh1);
    this.scene.add(this.mesh2);
    this.scene.add(this.mesh3);

    this.mesh.updateMatrixWorld(true);

}