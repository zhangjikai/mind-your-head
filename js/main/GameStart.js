/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-5
 * Time: 下午1:40
 */
GAME.GameStart = function () {
    var this_ = this;
    var container, scene, camera, renderer, controls, stats;
    var moveDirection = GAME.Constants.DIRECTION_NONE_MOVE;
    var maxDistance = 5000;
    var requestId;
    var rivalLife = 10;
    var showCount = 0;
    var winCount = 0;
    var lostCount = 0;
    var score = 0;
    var hitCount = 0;
    var genProps = true;
    var propCount = 0;
    /* var propNums = parseInt(Math.random() * 10);*/
    var propNums = 2;

    /*var bgm;
     var shootm;
     var hitm;
     */
    this.init = function () {
        container = document.getElementById('canvas3d');
        this.initThree();
        GAME.Sound.initMusic();
        GAME.Sound.playBgMusic();
      /* addListener();*/
        this.addListener();
        /*addStats();*/
        this.render();
        GAME.Helper.setTarget();
    }


    /** 初始化场景*/
    this.initThree = function () {
        scene = new THREE.Scene();
        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.set(0, 0, 500);
        camera.lookAt(scene.position);
        if (Detector.webgl) {
            renderer = new THREE.WebGLRenderer({
                antialias: true
            });
        } else {
            renderer = new THREE.CanvasRenderer();
        }
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        container.appendChild(renderer.domElement);

        var light = new THREE.PointLight(0xffffff);
        light.position.set(0, 250, 0);
        scene.add(light);

        var imagePrefix = "images/background/dawnmountain-";
        var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        var imageSuffix = ".png";
        var skyGeometry = new THREE.CubeGeometry(maxDistance, maxDistance, maxDistance);
        var materialArray = [];
        for (var i = 0; i < 6; i++) {
            materialArray.push(new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
                side: THREE.BackSide
            }));
        }
        var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
        var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(skyBox);

        GAME.Helper.WindowResize(renderer, camera);
        GAME.Helper.preventScroll();
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', this.render);
    }

    /** 更新场景*/
    this.update = function () {
        /* stats.update();*/
        controls.update();
        GAME.Helper.rangeShow();
        GAME.Helper.targetShow();
        updateEnemys();
        GAME.operate.updateCount();
        var length = GAME.ObjectPool.maxLength;
        var obj1;
        var obj2;
        var len;
        while (length--) {
            //普通子弹的移动
            if (GAME.ObjectPool.commonBullets[length] && GAME.ObjectPool.commonBullets[length].isShow) {
                GAME.ObjectPool.commonBullets[length].updateCommonBullet();
                checkCollisions(GAME.ObjectPool.commonBullets[length]);
            }
            //敌人子弹的移动
            if (GAME.ObjectPool.enemyBullets[length]) {
                GAME.ObjectPool.enemyBullets[length].updateEnemyBullet();
            }
            //爆炸效果
            if (GAME.ObjectPool.bulletParticles[length]) {
                GAME.ObjectPool.bulletParticles[length].updateBullet();
            }
            //炸弹爆炸后移动
            if (GAME.ObjectPool.mulBullets[length]) {
                GAME.ObjectPool.mulBullets[length].updateMulBullets();
                GAME.ObjectPool.mulBullets[length].checkCollsions();
            }
            //炸弹移动
            if (GAME.ObjectPool.otherBullets[length]) {
                GAME.ObjectPool.otherBullets[length].updateOtherBullet();
            }
            //雪花效果
            if (GAME.ObjectPool.snowParticles[length] && GAME.ObjectPool.snowParticles[length].isShow) {
                obj1 = GAME.ObjectPool.snowParticles[length];
                if (obj1.type == GAME.Constants.SNOW_PARTICLE) {
                    obj1.updateSnow();
                }
                if (obj1.type == GAME.Constants.SNOW_SPHERE) {
                    obj1.updateCommonBullet();
                    if (Math.abs(obj1.mesh.position.z) > 700 ||
                        Math.abs(obj1.mesh.position.y) > 700 || Math.abs(obj1.mesh.position.x) > 700) {
                        obj1.removeCommonBullet();
                        var paticleSystem = GAME.ObjectPool.getSnowParticle();
                        paticleSystem.beginSnow(obj1.mesh.position, scene);
                        len = GAME.ObjectPool.enemys.length;
                        while (len--) {
                            if (GAME.ObjectPool.enemys[len].isShow && GAME.Constants.COMMON_ENEMY) {
                                GAME.ObjectPool.enemys[len].isSnow = true;
                                //只对普通敌人有效
                                if (GAME.ObjectPool.enemys[len].type == GAME.Constants.RIVAL_ENEMY) {

                                }
                            }
                        }
                    }
                }
            }
            //激光效果
            if (GAME.ObjectPool.laserParticles[length] && GAME.ObjectPool.laserParticles[length].isShow) {
                GAME.ObjectPool.laserParticles[length].updateLaser(getTargetVector());
                len = GAME.ObjectPool.enemys.length;
                while (len--) {
                    //与敌人的碰撞检测
                    obj1 = GAME.ObjectPool.enemys[len];
                    if (obj1.isShow && obj1.type == GAME.Constants.COMMON_ENEMY) {
                        obj2 = GAME.ObjectPool.laserParticles[length].particleSystem;
                        if (GAME.Helper.checkAccurateCollision(obj2, obj1.mesh)) {
                            //shootm.play();
                            GAME.Sound.playHitSound();
                            obj1.removeEnemy();
                            hitEnemy(obj1.mesh.position);
                            GAME.ObjectPool.getBulletParticle().beginBullet(obj1.mesh, scene);
                        }
                    }
                    //与道具的碰撞检测
                    if (GAME.ObjectPool.props[len]) {
                        obj1 = GAME.ObjectPool.props[len];
                        if (obj1.isShow && GAME.Helper.checkAccurateCollision(obj2, obj1.mesh)) {
                            obj1.removeProps();
                            handleProps(obj1.type);
                        }
                    }
                }
            }
            //敌人和敌人之间的碰撞检测
            if (GAME.ObjectPool.enemys[length] && GAME.ObjectPool.enemys[length].isShow) {
                obj1 = GAME.ObjectPool.enemys[length];
                if (obj1.type == GAME.Constants.RIVAL_ENEMY) {
                    obj1.updateRivalEnemy(getTargetVector());
                    continue;
                }
                obj1.updateCommonEnemy(getTargetVector());
                len = length;
                while (len--) {
                    obj2 = GAME.ObjectPool.enemys[len];
                    if (obj2.isShow) {
                        if (GAME.Helper.checkCollision(obj1.mesh, obj2.mesh)) {
                            obj1.reverseMoveVector();
                            if (obj2.type == GAME.Constants.COMMON_ENEMY)
                                obj2.reverseMoveVector()
                        }
                    }
                }
            }
            //显示道具
            if (GAME.ObjectPool.props[length] && GAME.ObjectPool.props[length].isShow) {
                GAME.ObjectPool.props[length].updateProps();
            }
        }
    }

    this.setCameraPosition = function (type) {
        if (type == GAME.Constants.FIRST_PLACE)
            camera.position.set(0, 0, 500);
        if (type == GAME.Constants.SECOND_PLACE)
            camera.position.set(0, 0, -500);
    }

    /** 游戏主循环*/
    this.animate = function () {
        requestId = requestAnimationFrame(this_.animate);
        GAME.operate.moveBackground(moveDirection, controls)
        GAME.gravity.move(controls);
        this_.update();
        this_.render();
        this_.isLost();
        if (GAME.SharedVar.gameType == GAME.Constants.GRADE_MODE)
            this_.isWin();
    }

    this.stop = function () {
        window.cancelAnimationFrame(requestId);
        console.log("stop");
    }

    this.isLost = function () {
        if (lostCount++ <= 10) {
            return;
        }
        if (GAME.SharedVar.lifeSpare <= 0) {
            if (GAME.SharedVar.gameMode == GAME.Constants.SINGLE_MODE) {
                GAME.Sound.stopBgMusic();
                GAME.Sound.playOverSound();
                //resetAll();
                this_.removeListener();
                this_.stop();
                if (GAME.SharedVar.gameType == GAME.Constants.SCORE_MODE) {
                    GAME.record.save(parseInt($('#score_num').html()));
                }
                var flag = confirm('你输了 是否重新开始>>>');
                if (flag) {
                 /*  GAME.Sound.stopOverSound();
                    GAME.Sound.playBgMusic();
                    if (GAME.SharedVar.gameType == GAME.Constants.GRADE_MODE)
                        singleRestart();
                    if (GAME.SharedVar.gameType == GAME.Constants.SCORE_MODE) {
                        scoreRestart();
                    }*/
                	location.reload();
                } else {
                    this_.stop();
                    window.location.href = 'index.html';
                }
            } else {
                GAME.Sound.stopBgMusic();
                GAME.Sound.playOverSound();
                //resetAll();
                
                var text = '#heart' + GAME.SharedVar.lifeSpare;
                $(text).css({
                    display: 'none'
                });
                GAME.SharedVar.lifeSpare--;
                this_.stop();
                //GAME.gameStart.removeListener();
               GAME.Server.sendMessage(GAME.Protocol.TRANSMIT_DATA + GAME.Protocol.RIVAL_LOST);
               alert("你输了，即将返回游戏大厅");
               window.location.href = 'server/GameHall.jsp';
             /*  var flag = confirm('你输了>>> 是否重新开始???');
               if (flag) {
                    GAME.Sound.playBgMusic();
                    GAME.Sound.stopOverSound();
                    GAME.preOrder++;
                    GAME.Server.sendMessage(GAME.Protocol.TRANSMIT_DATA
                        + GAME.Protocol.PREPARE + GAME.preOrder);
                    GAME.waitHelper.showWaiting();
               } else {
                   window.location.href = 'server/GameHall.jsp';
               }*/
            }
        }
    }

    this.isWin = function () {
        if (GAME.SharedVar.gameMode == GAME.Constants.SINGLE_MODE) {
            if (winCount++ <= 100) {
                return;
            }
            if (GAME.SharedVar.enemysNum <= 0) {
                GAME.Sound.stopBgMusic();
                GAME.Sound.playSucSound();
                resetAll();
                this_.stop();
                var stage = parseInt(localStorage.getItem('gameStage')) + 1;
                localStorage.setItem('gameStage', stage);
                GAME.record.save(parseInt($('#score_num').html()));
                var win = confirm("你赢了！！！是否继续下一关？？？");
                if (win) {
                    /*GAME.Sound.stopSucSound();
                    GAME.Sound.playBgMusic();
                    winCount = 0;
                    GAME.SharedVar.enemysNum = 10;
                    GAME.Manager.startSingleGame(stage, camera, scene);*/
                	location.reload();
                } else {
                    this_.stop();
                    window.location.href = 'index.html';
                }
            }
        }
    }

    /** 渲染场景*/
    this.render = function () {
        renderer.clear();
        renderer.render(scene, camera);
    }

    function singleRestart() {

       // this_.addListener();
       /* bgm.play();*/
        GAME.Sound.playBgMusic();
        GAME.SharedVar.lifeSpare = 5;
        var length = 6;
        while (length--) {
            var text = '#heart' + length;
            $(text).css({
                display: 'block'
            });
        }
        var gameState = parseInt(localStorage.getItem('gameStage'));
        var grade = GAME.Manager.grades[gameState];
        GAME.SharedVar.enemysNum = grade.enemyNum;
        score = grade.score;
        $('#last_num').html(GAME.SharedVar.enemysNum);
        $('#score_num').html(0);
        GAME.SharedVar.enenyOnShow = 10;
        var enemys = GAME.ObjectPool.enemys;
        length = enemys.length;
        while (length--) {
            enemys[length].beginCommonEnemy(enemys, camera, scene);
        }

        /*   var bullets = GAME.ObjectPool.commonBullets;
         length = bullets.length;
         while (length--) {
         if (bullets[length].isShow) {
         bullets[length].removeCommonBullet();
         }
         }
         bullets = GAME.ObjectPool.enemyBullets;
         length = bullets.length;
         while (length--) {
         if (bullets[length].isShow) {
         bullets[length].removeEnemyBullet();
         }
         }*/
        //this_.animate();
    }

    function scoreRestart() {
        //resetAll();
        //this_.addListener();
        GAME.Sound.playBgMusic();
        GAME.SharedVar.lifeSpare = 5;
        var length = 5;
        while (length--) {
            var text = '#heart' + (length + 1);
            $(text).css({
                display: 'block'
            });
        }
        $('#score_num').html(0);
        GAME.SharedVar.enenyOnShow = 10;
        GAME.Manager.score = 5;
        var enemys = GAME.ObjectPool.enemys;
        length = enemys.length;
        while (length--) {
            enemys[length].speed = 3;
            enemys[length].eBulletSpeed = 5;
            enemys[length].shootTime = 500;
            enemys[length].beginCommonEnemy(enemys, camera, scene);
        }
        //this_.animate();
    }

    /** 获得屏幕中心点的3维坐标*/
    function getTargetVector() {
        var vector = new THREE.Vector3(0, 0, 0.5);
        GAME.Helper.transScreen2World(vector, camera);
        return vector;
    }

    /** 添加事件监听*/
    this.addListener = function () {
    /*function addListener(){*/
        //添加键盘监听
       $(document).keydown(function (event) {
            switch (event.keyCode) {
                case GAME.Key.UP:
                    controls.rotateDown();
                    moveDirection = GAME.Constants.DIRECTION_DOWN_MOVE;
                    break;
                case GAME.Key.DOWN:
                    controls.rotateUp();
                    moveDirection = GAME.Constants.DIRECTION_UP_MOVE;
                    break;
                case GAME.Key.LEFT:
                    controls.rotateRight();
                    moveDirection = GAME.Constants.DIRECTION_RIGHT_MOVE;
                    break;
                case GAME.Key.RIGHT:
                    controls.rotateLeft();
                    moveDirection = GAME.Constants.DIRECTION_LEFT_MOVE;
                    break;
                case GAME.Key.SPACE:
                    moveDirection = GAME.Constants.DIRECTION_NONE_MOVE;
            }
        });
        $(document).keyup(function (event) {
            if (event.keyCode == GAME.Key.S) {
                //GAME.Helper.FullScreen();
                GAME.operate.commonShoot(getTargetVector(), camera, scene);
                //shootm.play();
                GAME.Sound.playShootSound();
                return;
            }
            if (event.keyCode == GAME.Key.A) {
                GAME.operate.laserShoot(scene);
                return;
            }
            if (event.keyCode == GAME.Key.W) {
                GAME.operate.snowShoot(getTargetVector(), camera, scene);
                return;
            }
            if (event.keyCode == GAME.Key.D) {
                GAME.operate.bumbShoot(getTargetVector(), camera, scene);
            }
        });
        //重力感应监听
        /*  $(window).bind('devicemotion', GAME.gravity.motionHandler);*/

        document.getElementById('up').addEventListener('touchstart', function (ev) {
            ev.preventDefault();
            GAME.SharedVar.down = true;
            moveDirection = GAME.Constants.DIRECTION_DOWN_MOVE;
        }, false);
        /*document.getElementById('canvas3d').addEventListener('touchstart', function (ev) {
            ev.preventDefault();
            GAME.SharedVar.down = true;
            moveDirection = GAME.Constants.DIRECTION_DOWN_MOVE;
        	ev.preventDefault();
        	console.log("点击了canvas");
        }, false);*/
        document.getElementById('down').addEventListener('touchstart', function (ev) {
            ev.preventDefault();
            GAME.SharedVar.up = true;
            moveDirection = GAME.Constants.DIRECTION_UP_MOVE;
        }, false);
        document.getElementById('right').addEventListener('touchstart', function (ev) {
            ev.preventDefault();
            GAME.SharedVar.left = true;
            moveDirection = GAME.Constants.DIRECTION_LEFT_MOVE;
        }, false);
        document.getElementById('left').addEventListener('touchstart', function (ev) {
            ev.preventDefault();
            GAME.SharedVar.right = true;
            moveDirection = GAME.Constants.DIRECTION_RIGHT_MOVE;
        }, false);
        document.getElementById('pause').addEventListener('touchstart', function (ev) {
            ev.preventDefault();
            moveDirection = GAME.Constants.DIRECTION_NONE_MOVE;
        }, false);

        document.getElementById('up').addEventListener('touchend', function (ev) {
            ev.preventDefault();
            GAME.SharedVar.down = false;
        }, false);
        document.getElementById('down').addEventListener('touchend', function (ev) {
            ev.preventDefault();
            GAME.SharedVar.up = false;
        }, false);
        document.getElementById('left').addEventListener('touchend', function (ev) {
            ev.preventDefault();
            GAME.SharedVar.right = false;
        }, false);
        document.getElementById('right').addEventListener('touchend', function (ev) {
            ev.preventDefault();
            GAME.SharedVar.left = false;
        }, false);

        document.getElementById('bullet').addEventListener('touchstart', function (e) {
            e.preventDefault();
         GAME.operate.commonShoot(getTargetVector(), camera, scene);
         //shootm.play();
         GAME.Sound.playShootSound();
         GAME.Helper.FullScreen();
        }, false);
        document.getElementById('snowflake').addEventListener('touchstart', function (e) {
            e.preventDefault();
            GAME.operate.snowShoot(getTargetVector(), camera, scene);
        }, false);
        document.getElementById('laser').addEventListener('touchstart', function (e) {
            e.preventDefault();
            GAME.operate.laserShoot(scene);
        }, false);
        document.getElementById('snowflake_num').addEventListener('touchstart', function (e) {
            e.preventDefault();
            GAME.operate.snowShoot(getTargetVector(), camera, scene);
        }, false);
        document.getElementById('laser_num').addEventListener('touchstart', function (e) {
            e.preventDefault();
            GAME.operate.laserShoot(scene);
        }, false);
        document.getElementById('lighting_num').addEventListener('touchstart', function (e) {
            e.preventDefault();
            GAME.operate.bumbShoot(getTargetVector(), camera, scene);
        }, false);
        
        
        /* $('#bullet').click(function () {
         GAME.Helper.FullScreen();
         });*/

        /*  $('#bullet').click(function () {
         GAME.operate.commonShoot(getTargetVector(), camera, scene);
         */
        /*GAME.Helper.FullScreen();*/
        /*

         });
         $('#snowflake').click(function () {
         console.log('snowflake');
         GAME.operate.snowShoot(getTargetVector(), camera, scene);
         });
         $('#laser').click(function () {
         GAME.operate.laserShoot(scene);
         });*/
        /*   $('#snowflake').click(function () {
         console.log('snowflake');
         GAME.operate.snowShoot(getTargetVector(), camera, scene);
         });
         $('#laser').click(function () {
         GAME.operate.laserShoot(scene);
         });*/


    	/*$(document).bind('touchstart', function(ev) {});

        $('#up').bind('touchstart', function(ev) {
            ev.preventDefault();
            GAME.SharedVar.down = true;
            moveDirection = GAME.Constants.DIRECTION_DOWN_MOVE;
        });

        $('#down').bind('touchstart', function(ev) {
            ev.preventDefault();
            GAME.SharedVar.up = true;
            moveDirection = GAME.Constants.DIRECTION_UP_MOVE;
        });
        $('#right').bind('touchstart', function(ev) {
            ev.preventDefault();
            GAME.SharedVar.left = true;
            moveDirection = GAME.Constants.DIRECTION_LEFT_MOVE;
        });
        $('#left').bind('touchstart', function(ev) {
            ev.preventDefault();
            GAME.SharedVar.right = true;
            moveDirection = GAME.Constants.DIRECTION_RIGHT_MOVE;
        });

        $('#pause').bind('tarchstart', function(ev) {
            ev.preventDefault();
            moveDirection = GAME.Constants.DIRECTION_NONE_MOVE;
        });

        $('#left').bind('touchend', function(ev) {
            ev.preventDefault();
            GAME.SharedVar.right = false;
        });

        $('#right').bind('touchend', function(ev) {
            ev.preventDefault();
            GAME.SharedVar.left = false;
        });

        $('#up').bind('touchend', function(ev) {
            ev.preventDefault();
            GAME.SharedVar.down = false;
        });
        $('#down').bind('touchend', function(ev) {
            ev.preventDefault();
            GAME.SharedVar.down = false;
        });
        $('#bullet').bind('touchstart', function(ev) {
            ev.preventDefault();
            GAME.operate.commonShoot(getTargetVector(), camera, scene);
            //shootm.play();
            GAME.Sound.playShootSound();
            GAME.Helper.FullScreen();
        });
*/

        if (GAME.SharedVar.gravity)
            window.addEventListener('devicemotion', GAME.gravity.motionHandler, false);
    }

    function doNoting() {}

    this.removeListener = function () {
        document.getElementById('up').removeEventListener('touchstart', doNoting, false);
        document.getElementById('down').removeEventListener('touchstart', doNoting, false);
        document.getElementById('right').removeEventListener('touchstart', doNoting, false);
        document.getElementById('left').removeEventListener('touchstart', doNoting, false);
        document.getElementById('pause').removeEventListener('touchstart', doNoting, false);
        document.getElementById('up').removeEventListener('touchend', doNoting, false);
        document.getElementById('down').removeEventListener('touchend', doNoting, false);
        document.getElementById('right').removeEventListener('touchend', doNoting, false);
        document.getElementById('left').removeEventListener('touchend', doNoting, false);
        document.getElementById('bullet').removeEventListener('touchstart', doNoting, false);
        document.getElementById('snowflake').removeEventListener('touchstart', doNoting, false);
        document.getElementById('laser').removeEventListener('touchstart', doNoting, false);
        document.getElementById('lighting').removeEventListener('touchstart', doNoting, false);
    }

    /**添加性能监视*/
    function addStats() {
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 2;
        container.appendChild(stats.domElement);
    }

    /**普通子弹的碰撞检测*/
    function checkCollisions(bullet) {
        var enemys = GAME.ObjectPool.enemys;
        var enemyBullets = GAME.ObjectPool.enemyBullets;
        var props = GAME.ObjectPool.props;

        var i = enemyBullets.length > enemys.length ? enemyBullets.length : enemys.length;
        while (i--) {
            //我方子弹和对方子弹的碰撞检测
            if (enemyBullets[i]) {
                if (enemyBullets[i].isShow && GAME.Helper.checkCollision(bullet.mesh, enemyBullets[i].mesh)) {
                    bullet.removeCommonBullet();
                    enemyBullets[i].removeEnemyBullet();
                    return;
                }
            }
            //我方子弹和敌人的碰撞检测
            if (enemys[i]) {
                if (enemys[i].isShow && GAME.Helper.checkCollision(bullet.mesh, enemys[i].mesh)) {
                    scene.add(bullet.cubeMesh);
                    if (GAME.Helper.checkAccurateCollision(bullet.cubeMesh, enemys[i].mesh)) {
                        bullet.removeCommonBullet();
                        if (enemys[i].type === GAME.Constants.COMMON_ENEMY) {
                            //enemys[i].removeEnemy();
                            //hitEnemy(enemys[i].mesh.position);
                            // GAME.ObjectPool.getBulletParticle().beginBullet(enemys[i].mesh, scene);
                            //enemys[i].mesh.geometry = enemys[i].getHeadGeometry(200, 20,15, 71);
                            //console.log(enemys[i].mesh.geometry);
                            //console.log(enemys[i].getHeadGeometry(200,20,15,7));
                            //enemys[i].changeMesh(78);
                            /* enemys[i].mesh.material = enemys[i].getHeadMaterial(GAME.Constants.FACE_OPEN_MOUSE);*/
                            if (enemys[i].hitCount > 0) {
                                enemys[i].removeEnemy();
                                //hitm.play();
                                GAME.Sound.playHitSound();
                                hitEnemy(enemys[i].mesh.position);
                                GAME.ObjectPool.getBulletParticle().beginBullet(enemys[i].mesh, scene);
                                enemys[i].hitCount = 0;
                                /*enemys[i].mesh.lookAt(getTargetVector());*/
                            } else {
                                enemys[i].changeMesh(getTargetVector(), enemys[i].faceIndex);
                                GAME.Sound.playHitSound();
                                enemys[i].hitCount++;
                            }
                            return;
                        }
                        if (enemys[i].type === GAME.Constants.RIVAL_ENEMY) {
                            //做对应的处理
                            var text = '#heart' + GAME.SharedVar.rivalLife;
                            $(text).css({
                                display: 'none'
                            });
                            GAME.SharedVar.rivalLife--;
                            GAME.Server.sendMessage(GAME.Protocol.TRANSMIT_DATA + GAME.Protocol.HIT_RIVAL_ENEMY);
                            return;
                        }
                    }
                }
            }

            //和道具的碰撞检测
            if (props[i]) {
                if (props[i].isShow && GAME.Helper.checkCollision(bullet.mesh, props[i].mesh)) {
                    bullet.removeCommonBullet();
                    props[i].removeProps();
                    handleProps(props[i].type);
                }
            }
        }
    }

    function hitEnemy(position) {
        hitCount++;
        if (GAME.SharedVar.gameType == GAME.Constants.GRADE_MODE) {
            GAME.SharedVar.enemysNum--;
            GAME.SharedVar.enenyOnShow--;
            $('#last_num').html(GAME.SharedVar.enemysNum);
            var scores = parseInt($('#score_num').html()) + score;
            $('#score_num').html(scores);
            showCount = 0;
            winCount = 0;
        }
        if (GAME.SharedVar.gameType == GAME.Constants.SCORE_MODE) {
            GAME.SharedVar.enenyOnShow--;
            var scores = parseInt($('#score_num').html()) + GAME.Manager.score;
            console.log('GAME.Manager.score:' + GAME.Manager.score);
            $('#score_num').html(scores);
            showCount = 0;
            if (hitCount % 10 == 0) {
                GAME.Manager.setScoreGame(hitCount / 10 + 3, camera, scene);
            }
        }

        if (hitCount % 10 == 0) {
            genProps = true;
            propNums = parseInt(Math.random() * 10);
            propCount = 0;
        }

        if (genProps) {
            propCount++;
            if (propCount >= propNums) {
                GAME.ObjectPool.getProp(parseInt(Math.random() * 4)).beginProps(position, scene);
                /* GAME.ObjectPool.getProp(parseInt(1)).beginProps(position, scene);*/
                genProps = false;
            }
        }
    }

    function handleProps(type) {
        switch (type) {
            case GAME.Constants.PROPS_HEART:
                if (GAME.SharedVar.lifeSpare >= 5)
                    return;
                GAME.SharedVar.lifeSpare++;
                var text = '#heart' + GAME.SharedVar.lifeSpare;
                $(text).css({
                    display: 'block'
                });
                break;
            case GAME.Constants.PROPS_SNOW:
                GAME.operate.addSnowLeft();
                break;
            case GAME.Constants.PROPS_LASER:
                GAME.operate.addLaserLeft();
                break;
            case GAME.Constants.PROPS_BUMB:
                GAME.operate.addBumbLeft();
                break;
        }
    }

    function updateEnemys() {
        if (showCount++ >= 100 && GAME.SharedVar.enemysNum > GAME.SharedVar.enenyOnShow
            && GAME.SharedVar.enenyOnShow < 10) {
            GAME.ObjectPool.getCommonEnemy().beginCommonEnemy(GAME.ObjectPool.enemys, camera, scene);
            GAME.SharedVar.enenyOnShow++;
        }
    }

    //将所有的用到的变量重置
    function resetAll() {
        var length = GAME.ObjectPool.maxLength;
        var commonBullets = GAME.ObjectPool.commonBullets;
        var snowParticles = GAME.ObjectPool.snowParticles;
        var bulletParticles = GAME.ObjectPool.bulletParticles;
        var laserParticles = GAME.ObjectPool.laserParticles;
        var mulBullets = GAME.ObjectPool.mulBullets;
        var otherBullets = GAME.ObjectPool.otherBullets;
        var enemys = GAME.ObjectPool.enemys;
        var enemyBullets = GAME.ObjectPool.enemyBullets;
        var props = GAME.ObjectPool.props;
        while (length--) {
            if (enemys[length]) {
                enemys[length].removeEnemy();
            }
            if (commonBullets[length] && commonBullets[length].isShow) {
                commonBullets[length].removeCommonBullet();
            }
            if (snowParticles[length] && snowParticles[length].isShow) {
                snowParticles[length].scene.remove(snowParticles[length].particleSystem);
                snowParticles[length].isShow = false;
            }
            if (bulletParticles[length] && bulletParticles[length].isShow) {
                bulletParticles[length].isShow = false;
                bulletParticles[length].showTime = 0;
                bulletParticles[length].scene.remove(bulletParticles[length].particleSystem);
            }
            if (laserParticles[length] && laserParticles[length].isShow) {
                laserParticles[length].isShow = false;
                laserParticles[length].appearTime = 0;
                laserParticles[length].scene.remove(laserParticles[length].particleSystem);
            }
            if (mulBullets[length] && mulBullets[length].isShow()) {
                var i = mulBullets[length].bulletArray.length;
                while (i--) {
                    mulBullets[length].bulletArray[i].removeOtherBullet();
                }
            }
            if (otherBullets[length] && otherBullets[length].isShow) {
                otherBullets[length].removeOtherBullet();
            }
            if (enemyBullets[length] && enemyBullets[length].isShow) {
                enemyBullets[length].removeEnemyBullet();
            }
            if (props[length] && props[length].isShow) {
                props[length].showCount = 0;
                props[length].isShow = false;
                props[length].scene.remove(props[length].mesh);
            }
        }
        GAME.Helper.rangeShowCount = 50;
        GAME.Helper.targetShowCount = 50;
        moveDirection = GAME.Constants.DIRECTION_NONE_MOVE;
    }

    this.addRivalEnemy = function () {
        var i = 9;
        while (i--) {
            GAME.ObjectPool.getCommonEnemy().beginCommonEnemy(GAME.ObjectPool.enemys, camera, scene);
        }
        GAME.msgHandler.rivalEnemy = GAME.ObjectPool.getRivalEnemy();
        GAME.msgHandler.rivalEnemy.beginRivalEnemy(camera, scene);
    }

    this.getScene = function () {
        return scene;
    }

    this.getCamera = function () {
        return camera;
    }

    this.getRenderer = function () {
        return renderer;
    }

    this.getControls = function () {
        return controls;
    }

    this.setLostCount = function (count) {
        lostCount = count;
    }

    this.setScore = function (num) {
        score = num;
    }

    this.handleHit = function (position) {
        hitEnemy(position);
    }
    
    this.reset = function(){
    	resetAll();
    }
}

GAME.gameStart = new GAME.GameStart();