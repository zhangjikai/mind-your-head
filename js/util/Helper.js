/**
 * Created with JetBrains WebStorm. User: zhangjk Date: 13-7-28 Time: 上午9:26
 */

GAME.Helper = GAME.Helper || {}

/** 用来判断物体是否在相机的视野中 */
GAME.Helper.frustum = new THREE.Frustum();
/** 用于屏幕坐标和三维坐标的相互转换 */
GAME.Helper.projector = new THREE.Projector();
/** 记录所有正在显示的物体,用于窗口大小改变时，更改物体的大小 */
GAME.Helper.objectOnShow = new Array();
/** 用于物体的碰撞检测 */
GAME.Helper.rayCaster = new THREE.Raycaster;
/** 用于被敌人击中时的计数 */
GAME.Helper.rangeShowCount = 100;
/** 用于对战时被敌人击中的计数 */
GAME.Helper.targetShowCount = 100;

/** 全屏显示 */
GAME.Helper.FullScreen = function () {
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
}

/** 重新调整大小 */
GAME.Helper.WindowResize = function (renderer, camera) {
    var callback = function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        /*
		 * console.log("width:", screen.width); console.log("height",
		 * screen.height);
		 */
        GAME.Helper.setTarget();
        GAME.Helper.objectsResize();
    }
    // bind the resize event
    window.addEventListener('resize', callback, false);
    // return .stop() the function to stop watching window resize
    return {
        /** Stop watching window resize */
        stop: function () {
            window.removeEventListener('resize', callback);
        }
    };
}

GAME.Helper.setTarget = function () {
    $('#target').css({
        top: window.innerHeight / 2 - 25,
        left: window.innerWidth / 2 - 25
    });
    $('#range').css({
        top: window.innerHeight / 2 - 50,
        left: window.innerWidth / 2 - 50
    });

}

/** 防止用户拖动界面 */
GAME.Helper.preventScroll = function () {
    var preventDefaultScroll = function (event) {
        event.preventDefault();
        /* window.scrollTo(0, 1); */
        return false;
    };
    document.addEventListener('touchmove', preventDefaultScroll, false);
    console.log(this);
}

/** 打印属性的值 */
GAME.Helper.printAttr = function (name, attibute) {
    for (var i = 0; i < arguments.length; i = i + 2) {
        console.log(arguments[i], arguments[i + 1]);
    }
}

/**
 * 根据物体之间的距离判断物体是否碰撞，只用于球体和立方体
 * 
 * @param mesh1
 * @param mesh2
 * @returns {boolean} 如果碰撞返回true
 */
GAME.Helper.checkCollision = function (mesh1, mesh2) {
    var geometry1 = mesh1.geometry;
    var geometry2 = mesh2.geometry;
    var dis = GAME.Helper.caclDis(mesh1.position, mesh2.position);
    if (geometry1 instanceof THREE.SphereGeometry) {
        var r1 = mesh1.headRadius || geometry1.radius;
        if (geometry2 instanceof THREE.SphereGeometry) {
            var r2 = mesh2.headRadius || geometry2.radius;
            if (dis <= r1 + r2)
                return true;
            else
                return false;
        }
        if (geometry2 instanceof THREE.CubeGeometry) {
            var len = Math.sqrt(geometry2.width * geometry2.width + geometry2.height * geometry2.height + geometry2.depth * geometry2.depth) / 2;
            if (dis <= r1 + len)
                return true;
            else
                return false;
        }
    }

    if (geometry1 instanceof THREE.CubeGeometry) {
        var len1 = Math.sqrt(geometry1.width * geometry1.width + geometry1.height * geometry1.height + geometry1.depth * geometry1.depth) / 2;
        if (geometry2 instanceof THREE.SphereGeometry) {
            var r2 = mesh2.headRadius || geometry2.radius;
            if (dis <= len1 + r2)
                return true;
            else
                return false;
        }
        if (geometry2 instanceof THREE.CubeGeometry) {
            var len2 = Math.sqrt(geometry2.width * geometry2.width + geometry2.height * geometry2.height + geometry2.depth * geometry2.depth) / 2;
            if (dis <= len1 + len2)
                return true;
            else
                return false;
        }
    }

    if (geometry1 instanceof  THREE.IcosahedronGeometry || geometry2 instanceof THREE.IcosahedronGeometry) {
        var r1 = geometry1.radius;
        var r2 = geometry2.radius;
        if (dis < (r1 + r2)) {
            return true;
        } else
            return false;
    }
}

/**
 * 计算两点之间的距离
 * 
 * @param point1
 * @param point2
 * @returns {number}
 */
GAME.Helper.caclDis = function (point1, point2) {
    return Math.sqrt((point2.x - point1.x) * (point2.x - point1.x) + (point2.y - point1.y) * (point2.y - point1.y) + (point2.z - point1.z) * (point2.z - point1.z));
}

/**
 * 进行比较精确地碰撞检测
 * 
 * @param mesh
 * @param meshList
 * @returns {boolean}
 */
GAME.Helper.checkAccurateCollision = function (mesh, meshList) {
    var originPoint = mesh.position.clone();
    for (var vertexIndex = 0; vertexIndex < mesh.geometry.vertices.length; vertexIndex++) {
        var localVertex = mesh.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(mesh.matrix);
        var directionVector = globalVertex.sub(mesh.position);
        /*
		 * var ray = new THREE.Raycaster(originPoint,
		 * directionVector.clone().normalize());
		 */
        GAME.Helper.rayCaster.ray.origin = originPoint;
        GAME.Helper.rayCaster.ray.direction = directionVector.clone().normalize();
        var collisionResults = GAME.Helper.rayCaster.intersectObject(meshList);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            return true;
        }
    }
    return false;
}


/**
 * 判断物体是否在相机的视野中
 * 
 * @param camera
 * @param object
 * @returns {boolean} 如果在返回true
 */
GAME.Helper.checkInView = function (camera, object) {
    // 不加下面的代码似乎也没什么问题
    /*
	 * camera.updateMatrix(); // make sure camera's local matrix is updated
	 * camera.updateMatrixWorld(); // make sure camera's world matrix is updated
	 * camera.matrixWorldInverse.getInverse(camera.matrixWorld);
	 * 
	 * object.updateMatrix(); // make sure plane's local matrix is updated
	 * object.mesh.updateMatrixWorld(); // make sure plane's world matrix is
	 * updated
	 */
    GAME.Helper.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
    return GAME.Helper.frustum.intersectsObject(object);
}

/**
 * 将屏幕上的坐标转换为三维坐标 其中vector的初始化应为 var vector = new THREE.Vector3(( x /
 * window.innerWidth ) * 2 - 1,- ( y / window.innerHeight ) * 2 + 1,0.5 );
 * 
 * @param vector
 * @param camera
 */
GAME.Helper.transScreen2World = function (vector, camera) {
    GAME.Helper.projector.unprojectVector(vector, camera);
    vector.sub(camera.position).normalize();
}

/**
 * 将三维坐标转为屏幕上的坐标
 * 
 * @param object
 * @param camera
 * @returns {THREE.Vector3}
 */
GAME.Helper.transWorld2Screen = function (object, camera) {
    var widthHalf = window.innerWidth / 2;
    var heightHalf = window.innerHeight / 2;
    var vector = new THREE.Vector3();
    GAME.Helper.projector.projectVector(vector.getPositionFromMatrix(object.matrixWorld), camera);
    vector.x = ( (vector.x) * widthHalf ) + widthHalf;
    vector.y = -( (vector.y) * heightHalf ) + heightHalf;
    return vector;
}

/** 重新设置物体的大小 */
GAME.Helper.objectsResize = function () {
    var x_temp = GAME.SharedVar.scWidthHalf;
    var y_temp = GAME.SharedVar.scHeightHalf;
    GAME.SharedVar.initScreenVlaues();
    if (x_temp != GAME.SharedVar.scWidthHalf) {
        var scale = window.innerWidth / window.innerHeight / GAME.Constants.SCREEN_ASPECT_RADIO;
        for (var i = 0; i < GAME.Helper.objectOnShow.length; i++) {
            GAME.Helper.objectOnShow[i].scale.x = scale;
            GAME.Helper.objectOnShow[i].scale.y = scale;
            GAME.Helper.objectOnShow[i].scale.z = scale;
        }
    }
}

GAME.Helper.rangeShow = function() {
    if(this.rangeShowCount > 30)
        return;
    this.rangeShowCount++;
    var temp = parseInt(this.rangeShowCount / 5);
    /* console.log(temp % 2); */
    if(temp % 2) {
        $('#range').css('display','none');
    } else {
        $('#range').css('display','block');
    }
}

GAME.Helper.targetShow = function(){
	if(this.targetShowCount > 30) {
		return;
	}
	this.targetShowCount++;
	/*var temp = parseInt(this.targetShowCount/5);
	if(temp % 2) {
		 $('#target').css('display','none');
	} else {
		 $('#target').css('display','block');
	}*/
}



