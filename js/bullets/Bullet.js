/**
 * Created with JetBrains WebStorm. User: zhangjk Date: 13-9-1 Time: 下午4:33
 */
GAME.Bullet = function() {
	this.radius = 50;
	this.speed = 10;
	this.mesh = null;
	this.isShow = null;
	this.color = 0xffffff;
	this.image = null;
	this.moveVector = new THREE.Vector3();
}

GAME.Bullet.prototype = {
	constructor : GAME.Enemy,
	sharedObjs : [],
	maxDis : 2500,
	scene : null,
	camera : null,

	checkBounds : function() {
		var p = this.mesh.position;
		
		if (Math.abs(p.x) > this.maxDis || Math.abs(p.y) > this.maxDis || Math.abs(p.z) > this.maxDis) {
			
			return true;
		}
		return false;
	},

	getCubeGeometry : function(width, height, depth) {
		var markText = "CommonCubeGeometry:" + width + "<>" + height + "<>" + depth;
		var length = this.sharedObjs.length;
		while (length--) {
			if (this.sharedObjs[length].markText == markText) {
				return this.sharedObjs[length];
			}
		}
		var geometry = new THREE.CubeGeometry(width, height, depth);
		geometry.markText = markText;
		this.sharedObjs.push(geometry);
		return geometry;
	},

	getGeometry : function(radius, image) {
		if (image === null)
			var markText = "CommonBulletGeometry:" + radius;
		else
			markText = "CommonBulletGeometry:" + radius + "image";
		var length = this.sharedObjs.length;
		while (length--) {
			if (this.sharedObjs[length].markText == markText) {
				return this.sharedObjs[length];
			}
		}
		var geometry = new THREE.SphereGeometry(radius, 20, 12);
		geometry.markText = markText;
		this.sharedObjs.push(geometry);
		return geometry;
	},

	getMaterial : function(color, image) {
		var markText = "CommonBulletMaterial:" + color + "<>" + image;
		var length = this.sharedObjs.length;
		while (length--) {
			if (this.sharedObjs[length].markText == markText) {
				return this.sharedObjs[length];
			}
		}
		if (image === null) {
			var material = new THREE.MeshLambertMaterial({
				color : color
			});
		} else {
			var material = new THREE.MeshBasicMaterial({
				map : THREE.ImageUtils.loadTexture("images/ice.png")
			});
		}
		material.markText = markText;
		this.sharedObjs.push(material);
		return material;
	},

	setValues : function(values) {
		if (values === undefined)
			return;
		for ( var key in values) {
			var newValue = values[key];
			if (newValue === undefined) {
				console.warn('GAME.Bullet: \'' + key + '\' parameter is undefined.');
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