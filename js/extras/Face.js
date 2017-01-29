/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-11-2
 * Time: 上午9:31
 * To change this template use File | Settings | File Templates.
 */
GAME.Face = {

    imgText: 'image1',
    image:null,

    getCommonFace: function () {
   	
        var width = window.innerWidth;
        var height = window.innerHeight;
        var picType = localStorage.getItem('picType');
        var image_ = new Image();
        image_.src = localStorage.getItem('picName');

        if(picType == 'select') {
            this.image = document.getElementById('faceId');
        } else {
        	this.image = document.getElementById('faceId2');
        }

        
        var index = parseInt(Math.random()*2 + 1);
        this.imgText = 'image'+index;
        var image1 = document.getElementById(this.imgText);
        var canvas = document.getElementById('face');
        canvas.width = width * 0.8;
        canvas.height = height;
        var context = canvas.getContext('2d');
        context.drawImage(this.image, 0, height * 0.2, width * 0.8, height * 0.6);
        context.drawImage(image1, 0, 0, width * 0.8, height);
        return canvas;
    },

    getSelectFace:function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var image = new Image();
        var num = localStorage.num;
        image.src = localStorage.getItem('picName');
        var index = parseInt(Math.random() * 5 + 1);
        /*this.imgText = 'image'+index;*/
        this.imgText = 'image1';
        var image1 = document.getElementById(this.imgText)
        console.log(image1.src);
        console.log(localStorage[num]);
        var canvas = document.getElementById('face');
        canvas.width = width * 0.8;
        canvas.height = height;
        var context = canvas.getContext('2d');
        //context.drawImage(image, width * 0.1, height * 0.15, width * 0.6, height * 0.7);
        context.drawImage(image, 0, height * 0.2, width * 0.8, height * 0.6);
        context.drawImage(image1, 0, 0, width * 0.8, height);
        return canvas;
    },

    getOpenMouthFace: function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
       /* var image = new Image();
        var picType = localStorage.getItem('picType');
        if(picType == 'select') {
            console.log(localStorage.getItem('picName'));
            image.src = localStorage.getItem('picName');
        } else {
            var num = localStorage.num;
            image.src = localStorage.getItem(num);
        }*/
        /*var picType = localStorage.getItem('picType');
        if(picType == 'select') {
             this.image.src = localStorage.getItem('picName');
             console.log('localStorage.getItem(picName)  '+localStorage.getItem('picName'));
             this.image = document.getElementById('faceId');
         } else {
             var num = localStorage.num;
             this.image = new Image();
             this.image.src = localStorage.getItem(num);
         	this.image = document.getElementById('faceId2');
         }*/
        var image1 = document.getElementById(this.imgText)
        var mouthImg = document.getElementById('mouth');
        var canvas = document.getElementById('face2');
        canvas.width = width * 0.8;
        canvas.height = height;
        var context = canvas.getContext('2d');
        context.drawImage(this.image, 0, height * 0.2, width * 0.8, height * 0.6);
        context.drawImage(image1, 0, 0, width * 0.8, height);
        context.drawImage(mouthImg, width * 0.33, height * 0.57, width * 0.155, height * 0.15);
        return canvas;
    },

    changeFaceEyeBrow: function (geometry, num) {
        var vector;
        for (var i = 0; i < geometry.vertices.length; i++) {
            vector = geometry.vertices[i];
            if (vector.z == 30) {
                /*console.log('x', vector.x);
                console.log('y', vector.y);*/
                /* if (Math.abs(vector.y + 64) > 64 && Math.abs(vector.y + 64) < 84 && Math.abs(vector.x) < 40) {
                 vector.y += num;
                 }*/
                if (Math.abs(vector.y) < 50 && Math.abs(vector.y) < 50 && Math.abs(vector.x) < 80) {
                    vector.y += num;
                }
            }
        }
        geometry.verticesNeedUpdate = true;
    },

    changeNoseMouth: function (geometry, num) {
        var vector;
        for (var i = 0; i < geometry.vertices.length; i++) {
            vector = geometry.vertices[i];
            if (vector.z == 30) {
                /*console.log('x', vector.x);
                 console.log('y', vector.y);*/

                if (Math.abs(vector.y) > 100 && Math.abs(vector.y) < 150 && Math.abs(vector.x) < 60) {
                    vector.y += num;
                    if (vector.x > 10) {
                        vector.x += num;
                    }
                    if (vector.x < -10) {
                        vector.x -= num;
                    }
                }
                if (Math.abs(vector.y) > 150 && Math.abs(vector.y) < 180 && Math.abs(vector.x) < 60) {
                    vector.y += num;
                }
            }
        }
        geometry.verticesNeedUpdate = true;
    },

    changeMouth: function (geometry, num) {
        var vector;
        for (var i = 0; i < geometry.vertices.length; i++) {
            vector = geometry.vertices[i];
            if (vector.z == 30) {

                if (Math.abs(vector.y) > 150 && Math.abs(vector.y) < 200 && Math.abs(vector.x) < 60) {
                    vector.y += num;
                }
            }
        }
        geometry.verticesNeedUpdate = true;
    },

    changeFaceSize: function (geometry, num) {
        var vector;
        for (var i = 0; i < geometry.vertices.length; i++) {
            vector = geometry.vertices[i];
            if (vector.z == 30) {
                if (vector.x < -20)
                    vector.x -= num;
                if (vector.x > 20)
                    vector.x += num
            }
        }
        geometry.verticesNeedUpdate = true;
    }
}