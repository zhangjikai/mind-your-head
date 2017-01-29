/**
 * Created with JetBrains WebStorm. User: zhangjk Date: 13-9-4 Time: 上午10:04
 */

setTimeout(function () {
    var model = document.getElementById("model");
    var spider = document.getElementById("spider");
    spider.className = "spider_move";
    setTimeout(function () {
        model.className = "model_move";
    }, 1500);

}, 1000);

GAME.openScreen = {
    gameMode: GAME.Constants.SINGLE_MODE,
    changeModel: function () {
        var model = document.getElementById("model");
        if (model.className == "model_move") {
            model.className = "model_unlimited";
            model.innerHTML = "无限模式";
            this.gameMode = GAME.Constants.SINGLE_MODE;
            localStorage.setItem('gameType', GAME.Constants.SCORE_MODE);
        } else if (model.className == "model_unlimited") {
            model.className = "model_multi";
            model.innerHTML = "对战模式";
            this.gameMode = GAME.Constants.FIGHT_MODE;
        } else if(model.className == "model_multi"){
            model.className = "model_level";
            model.innerHTML = "关卡模式";
            this.gameMode = GAME.Constants.SINGLE_MODE;
            localStorage.setItem('gameType', GAME.Constants.GRADE_MODE);
        }else if(model.className == "model_level"){
            model.className = "model_unlimited";
            model.innerHTML = "无限模式";
            this.gameMode = GAME.Constants.SINGLE_MODE;
            localStorage.setItem('gameType', GAME.Constants.SCORE_MODE);
        }
    },

    fullScreen: function () {
        /*
         * var docElm = document.documentElement; if (docElm.requestFullscreen) {
         * docElm.requestFullscreen(); } else if (docElm.mozRequestFullScreen) {
         * docElm.mozRequestFullScreen(); } else if
         * (docElm.webkitRequestFullScreen) { docElm.webkitRequestFullScreen(); }
         */

        if (window.screen) {// 判断浏览器是否支持window.screen判断浏览器是否支持screen
            var myw = screen.availWidth; // 定义一个myw，接受到当前全屏的宽
            var myh = screen.availHeight; // 定义一个myw，接受到当前全屏的高
            window.moveTo(0, 0); // 把window放在左上脚
            window.resizeTo(myw, myh); // 把当前窗体的长宽跳转为myw和myh
        }
    },

    showMenu: function () {
        var triangle = document.getElementById("triangle");
        if (triangle.className == "triangle_right") {
            triangle.className = "triangle_left";
            document.getElementById("menu").className = "menu_show";
        } else {
            triangle.className = "triangle_right";
            document.getElementById("menu").className = "menu_fade";
            this.fade();
            this.show();
        }
    },

    showCamera: function () {
        /*
         * var rank = document.getElementById("camera"); if (rank.className ==
         * "camera_white") { rank.className = "camera_blue";
         * document.getElementById("camera_block").className = "camera_show"; }
         * else { rank.className = "camera_white";
         * document.getElementById("camera_block").className = "camera_fade"; }
         */
    },

    showSet: function () {
        var set = document.getElementById("set");
        if (set.className == "set_white") {
            this.fade();
            set.className = "set_blue";
            document.getElementById("set_block").className = "set_show";
        } else {
            set.className = "set_white";
            document.getElementById("set_block").className = "set_fade";
            this.show();
        }
    },

    showRank: function () {
        GAME.record.check();
        $('#first').html(localStorage.getItem('record0'));
        $('#second').html(localStorage.getItem('record1'));
        $('#third').html(localStorage.getItem('record2'));
        $('#fouth').html(localStorage.getItem('record3'));
        $('#fifth').html(localStorage.getItem('record4'));
        var rank = document.getElementById("rank");
        if (rank.className == "rank_white") {
            this.fade();
            rank.className = "rank_blue";
            document.getElementById("rank_block_top").className = "rank_show";
            document.getElementById("rank_block_bottom").className = "rank_show";
            setTimeout(function () {
                document.getElementById("first").className = "first_show";
            }, 600);
        } else {
            rank.className = "rank_white";
            document.getElementById("rank_block_top").className = "rank_fade";
            document.getElementById("rank_block_bottom").className = "rank_fade";
            document.getElementById("first").className = "first_fade";
            this.show();
        }
    },
	
	showAbout: function () {
        var about = document.getElementById("about");
        if (about.className == "about_white") {
            this.fade();
            about.className = "about_blue";
            document.getElementById("about_block").className = "about_show";
        } else {
            about.className = "about_white";
            document.getElementById("about_block").className = "about_fade";
            this.show();
        }
    },
	

    fade: function () {
        document.getElementById("rank").className = "rank_white";
        document.getElementById("rank_block_top").className = "rank_fade";
        document.getElementById("rank_block_bottom").className = "rank_fade";

        document.getElementById("set").className = "set_white";
        document.getElementById("set_block").className = "set_fade";

        document.getElementById("about").className = "about_white";
        document.getElementById("about_block").className = "about_fade";

        document.getElementById("model").className = "model_fade";
        document.getElementById("spider").className = "spider_fade";
    },

    show: function () {
        spider.className = "spider_move";
        setTimeout(function () {
            model.className = "model_move";
        }, 150);
    },

    start: function () {
        localStorage.setItem('gameMode', this.gameMode);
        this.setItems();
        var gameStage = localStorage.getItem('gameStage');
        if (gameStage === undefined || gameStage === 'NaN' || gameStage === null) {
            localStorage.setItem('gameStage', 0);
        }

        if (this.gameMode == GAME.Constants.SINGLE_MODE) {
            if (document.getElementById('photo').checked) {
                localStorage.setItem('picType', 'photo');
                document.location.href = "photo/getPhoto.html";
            } else {
                localStorage.setItem('picType', 'select');
                document.location.href = 'server/loginUpImg.jsp'
            }
        }

        if (this.gameMode == GAME.Constants.FIGHT_MODE) {
//        	var filename = document.location.search.split('&')[document.location.search.split('&').length-1].substring(9);
//    		if(  ((localStorage.getItem('picName') == null) || (localStorage.getItem('picName') == '')) 
//    				&& 
//    			((filename != null) || (filename != ''))  ){
//    			localStorage.setItem('picName', './server/userImages/'+document.location.search.split('&')[0].substring(9)+'/'+filename);
//    			alert(filename);
//    			alert('asdfasdf222');
//    		}
    		localStorage.setItem('picType', 'select');
            document.location.href = "server/index.jsp";
        }
    },

    setItems: function () {
        var sound = document.getElementById('sound').checked;
        if (sound) {
            localStorage.setItem('sound', 1);
        } else {
            localStorage.setItem('sound', 0);
        }
        var music = document.getElementById('music').checked;
        if (music) {
            localStorage.setItem('music', 1);
        } else {
            localStorage.setItem('music', 0);
        }
        var photo = document.getElementById('photo').checked;
        if (photo) {
            localStorage.setItem('photo', 1);
        } else {
            localStorage.setItem('photo', 0);
        }
        /*var grade = document.getElementById('gameType').checked;
        if (grade) {
            localStorage.setItem('gameType', GAME.Constants.GRADE_MODE);
        } else {
            localStorage.setItem('gameType', GAME.Constants.SCORE_MODE);
        }*/
        var gravity = document.getElementById('gravity').checked;
        if (gravity) {
            localStorage.setItem('gravity', 1);
        } else {
            localStorage.setItem('gravity', 0);
        }

    }
}

window.onload = function () {

   /* if(document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
        bodyTag = document.getElementsByTagName('body')[0];
        bodyTag.style.height = document.documentElement.clientHeight+100+'px';
    }
    setTimeout(function() {
        window.scrollTo(0, 1)
    }, 0);*/

    localStorage.setItem('gameType', GAME.Constants.GRADE_MODE);
    var sound = localStorage.getItem('sound') || 1;
    var music = localStorage.getItem('music') || 1;
    var photo = localStorage.getItem('photo') || 1;
    console.log(photo);
  /*  var gameType = localStorage.getItem('gameType') || GAME.Constants.GRADE_MODE;*/
    if (window.DeviceMotionEvent) {
        var gravity = localStorage.getItem('gravity') || 1;
    } else {
        document.getElementById('gravity').disabled = true;
        var gravity = 0;
    }

    document.getElementById('sound').checked = parseInt(sound);
    document.getElementById('music').checked = parseInt(music);
    document.getElementById('photo').checked = parseInt(photo);
   /* if (gameType == GAME.Constants.GRADE_MODE) {
        document.getElementById('gameType').checked = true;
    } else {
        document.getElementById('gameType').checked = false;
    }*/
    document.getElementById('gravity').checked = parseInt(gravity);
}
