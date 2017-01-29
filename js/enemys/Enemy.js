/**
 * Created with JetBrains WebStorm. User: zhangjk Date: 13-9-1 Time: 下午12:05
 */
var GAME = GAME || {}
GAME.Enemy = function () {
    this.radius = 30;
    this.speed = 3;
    this.lookVector = new THREE.Vector3();
    this.isShow = false;
    this.mesh = null;
    this.mesh1 = null;
    this.mesh2 = null;
    this.mesh3 = null;
    this.topImage = null;
    this.headImage = null;
    this.color = 0xffffff;
    this.angle = 0;
    this.topRotateSpeed = 0.1;
}

GAME.Enemy.prototype = {
    constructor: GAME.Enemy,
    sharedObjs: [],
    scene: null,
    camera: null,
    initEnemy: function () {
        var type = parseInt(Math.random() * 8 + 70);
        /*console.log("type", type);*/
        /*type = 77;*/
        var sphere = this.getHeadGeometry(this.radius, 20, 15, 70);
        
        var material;       
        material = this.getHeadMaterial();
      
        this.mesh = new THREE.Mesh(sphere, material);
        this.mesh.headRadius = this.radius * 4 / 3;
        var geometry1 = this.getCylinderGeometry(this.radius / 10, this.radius / 10, this.radius * 0.4);
        var geometry2 = this.getCylinderGeometry(this.radius / 10, this.radius / 10, this.radius * 1.5);
        var material1 = this.getMaterial(this.color, this.topImage);
        this.mesh1 = new THREE.Mesh(geometry1, material1);
        this.mesh2 = new THREE.Mesh(geometry2, material1);
        this.mesh2.rotation.z = 1.57;
        this.mesh3 = new THREE.Mesh(geometry2, material1);
        this.mesh3.rotation.x = -1.57;
    },

    rotateTop: function () {
        this.angle += this.topRotateSpeed;
        this.mesh1.rotation.y = this.angle;
        this.mesh2.rotation.y = this.angle;
        this.mesh3.rotation.z = this.angle;
        if (this.angle >= 6.28) {
            this.angle = 0;
        }
    },

    removeEnemy: function () {
        this.isShow = false;
        if (this.scene) {
            this.scene.remove(this.mesh);
            this.scene.remove(this.mesh1);
            this.scene.remove(this.mesh2);
            this.scene.remove(this.mesh3);
        }
    },

    getHeadGeometry: function (radius, widthSegments, heightSegments, type) {
        type = type || GAME.Constants.FACE_COMMON;
        var markText = "EnemyHead:" + radius + "<>" + widthSegments + "<>" + heightSegments + "<>" + type;
        var length = this.sharedObjs.length;
        while (length--) {
            if (this.sharedObjs[length].markText == markText) {
                return this.sharedObjs[length];
            }
        }
        var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        var r = 0;
        var radio = 4 / 3;
        for (var i = 0; i <= heightSegments; i++) {
            for (var j = 0; j <= widthSegments; j++) {
                var vector = geometry.vertices[(widthSegments + 1) * i + j];
                /* var u = j / w; */
                if (i <= heightSegments / 3) {
                    var v = i / (heightSegments * 2 / 3);
                    vector.y = radius * Math.cos(v * Math.PI);
                    r = Math.sqrt(radius * radius - vector.y * vector.y);
                    vector.x = r * Math.sin(Math.PI / widthSegments * j * 2 + Math.PI);
                    vector.z = r * Math.cos(Math.PI / widthSegments * j * 2 + Math.PI);
                    if (vector.z > 30 && vector.y < 12) {
                        vector.z = 30;
                    }
                } else {
                    v = (i + heightSegments / 3) / (heightSegments * 4 / 3);
                    vector.y = radius * radio * Math.cos(v * Math.PI);
                    r = Math.sqrt((radius * radio * radius * radio - vector.y * vector.y) * (radius * radius)
                        / (radius * radio * radius * radio));
                    vector.x = r * Math.sin(Math.PI / widthSegments * j * 2 + Math.PI);
                    vector.z = r * Math.cos(Math.PI / widthSegments * j * 2 + Math.PI);
                    if (vector.z > 30) {
                        vector.z = 30;
                    }
                }
            }
        }

        /**
         * 眼睛和眉毛发生变化
         * 向下-20
         * 向上40
         */
        //GAME.Face.changeFaceEyeBrow(geometry, 40);


        /**
         * 鼻子和嘴
         * +20，-10
         */
        //GAME.Face.changeNoseMouth(geometry,20);
        /*geometry.verticesNeedUpdate = true;*/

        /**
         * 嘴
         * +20，-20
         */
        // GAME.Face.changeMouth(geometry, -20);

        /**
         * 脸
         * +30， -20
         */
        GAME.Face.changeFaceSize(geometry, -20);

        switch (type) {
            case GAME.Constants.FACE_COMMON:
                geometry.verticesNeedUpdate = true;
                break;
            case GAME.Constants.FACE_EYE_BROW_UP:
                GAME.Face.changeFaceEyeBrow(geometry, 40);
                break;
            case GAME.Constants.FACE_EYE_BROW_DOWN:
                GAME.Face.changeFaceEyeBrow(geometry, -20);
                break;
            case GAME.Constants.FACE_NOSE_MOUTH_UP:
                GAME.Face.changeNoseMouth(geometry, 20);
                break;
            case GAME.Constants.FACE_NOSE_MOUTH_DOWN:
                GAME.Face.changeNoseMouth(geometry, -20);
                break;
            case GAME.Constants.FACE_MOUSE_UP:
                GAME.Face.changeMouth(geometry, 20);
                break;
            case GAME.Constants.FACE_MOUSE_DOWN:
                GAME.Face.changeMouth(geometry, -20);
                break;
            case GAME.Constants.FACE_SIZE_BIG:
                GAME.Face.changeFaceSize(geometry, 30);
                break;
            case GAME.Constants.FACE_SIZE_SMALL:
                GAME.Face.changeFaceSize(geometry, -15);
                break;
        }

        geometry.markText = markText;
        this.sharedObjs.push(geometry);
        return geometry;
    },

    getCylinderGeometry: function (top, buttom, height) {
        var markText = "EnemyCylinder:" + top + "<>" + buttom + "<>" + height;
        var length = this.sharedObjs.length;
        while (length--) {
            if (this.sharedObjs[length].markText == markText) {
                return this.sharedObjs[length];
            }
        }
        var cylinder = new THREE.CylinderGeometry(top, buttom, height);
        cylinder.markText = markText;
        this.sharedObjs.push(cylinder);
        return cylinder;
    },

    getHeadMaterial: function (type) {
        type = type || GAME.Constants.FACE_COMMON;
        var num = localStorage.num;
        var markText = "EnemyMaterial:" + "head" + num + "<>" + type;
        /*console.log('num:' + localStorage.num);*/
        var length = this.sharedObjs.length;
        while (length--) {
            if (this.sharedObjs[length].markText == markText) {
                return this.sharedObjs[length];
            }
        }

        var image = new Image();
        /*image.src = localStorage.getItem(num);*/
        switch (type) {
            case GAME.Constants.FACE_COMMON:
                image.src = GAME.Face.getCommonFace().toDataURL('image/png');
                image.src = GAME.Face.getCommonFace().toDataURL('image/png');
                break;
            case GAME.Constants.FACE_OPEN_MOUSE:
                image.src = GAME.Face.getOpenMouthFace().toDataURL("image/png");
                break;
            default:
                image.src = GAME.Face.getCommonFace().toDataURL('image/png');
                
        }

        /*var image = GAME.Face.getCommonFace();*/

        var texture = new THREE.Texture(image);
        texture.needsUpdate = true;
        var material;
        material = new THREE.MeshBasicMaterial({
            map: texture
        });
        material.markText = markText;
        this.sharedObjs.push(material);
        console.log(this.sharedObjs.length);
        return material;

    },

    getMaterial: function (color, image) {
        var markText = "EnemyMaterial:" + color + "<>" + image;
        var length = this.sharedObjs.length;
        while (length--) {
            if (this.sharedObjs[length].markText == markText) {
                return this.sharedObjs[length];
            }
        }
        var material;
        if (image == null) {
            material = new THREE.MeshLambertMaterial({
                color: color,
                transparent: true
            });
        } else {
            /*var image_ = new Image();
            image_.src = GAME.Face.getSelectFace().toDataURL('image/png');
            var texture = new THREE.Texture(image_);
            texture.needsUpdate = true;*/
            material = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(image),
               /* map:texture,*/
                transparent: true
            });
            /* console.log(image); */
        }
        material.markText = markText;
        this.sharedObjs.push(material);
        return material;
    },

    setValues: function (values) {
        if (values === undefined)
            return;
        for (var key in values) {
            var newValue = values[key];
            if (newValue === undefined) {
                console.warn('GAME.Enemy: \'' + key + '\' parameter is undefined.');
                continue;
            }
            if (key in this) {
                var currentValue = this[key];
                if (currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3) {
                    currentValue.copy(newValue);
                } else {
                    this[key] = newValue;
                }
            }
        }
    }
}