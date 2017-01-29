/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-8-20
 * Time: 上午9:35
 */

GAME.Gravity = function () {
    var alpha_ = 0.8;
    var gravity_ = [0, 0];
    var linearX_ = 0;
    var linearY_ = 0;
    var graX_ = 0
    var graY_ = 0;
    var moveDirect_ = 0;


    function getPgjs() {
        var agent = navigator.userAgent.toLowerCase();
        var res = agent.match(/android/);
        if (res == "android")
            return res;
        res = agent.match(/iphone/);
        if (res == "iphone")
            return "ios";
        res = agent.match(/ipad/);
        if (res == "ipad")
            return "ios";
        res = agent.match(/windows/);
        if (res == "windows")
            return "wp";
        return "pc";
    }

    this.motionHandler = function (e) {

        e.preventDefault();
        var event = e.accelerationIncludingGravity;
        if(getPgjs() == "android" || getPgjs() == "iphone"){
            graX_ = event.x - 5;
             graX_ = graX_.toFixed(1);
             graY_ = event.y.toFixed(1);
        } else {
            graY_ = -event.x;
            graX_ = event.y - 5;
            graX_ = graX_.toFixed(1);
        }


        gravity_[0] = alpha_ * gravity_[0] + (1 - alpha_) * event.x;
        gravity_[1] = alpha_ * gravity_[1] + (1 - alpha_) * event.y;
        /*linearX_ = Math.abs(parseInt(event.x - gravity_[0]));
         linearY_ = Math.abs(parseInt(event.y - gravity_[1]));*/

        if(getPgjs() == "android" || getPgjs() == "iphone"){
            linearX_ = event.x - gravity_[0];
            linearY_ = event.y - gravity_[1];
            linearX_ = Math.abs(linearX_.toFixed(1));
            linearY_ = Math.abs(linearY_.toFixed(1));
        } else{
            linearY_ = event.x - gravity_[0];
            linearX_ = event.y - gravity_[1];
            linearY_ = Math.abs(linearY_.toFixed(1));
            linearX_ = Math.abs(linearX_.toFixed(1));
        }

        if (linearX_ >= 0.5 || linearY_ >= 0.5) {
            if (linearX_ > linearY_) {
                moveDirect_ = GAME.Constants.DIRECTION_X_MOVE;
            } else if (linearY_ > linearX_) {
                moveDirect_ = GAME.Constants.DIRECTION_Y_MOVE;
            }
        }
        showText(graX_, graY_, linearX_, linearY_);
    }

    this.move = function (controls) {

        if (moveDirect_ == GAME.Constants.DIRECTION_X_MOVE) {
            if (Math.abs(graY_) >= Math.abs(graX_) + 2.5) {
                moveDirect_ = GAME.Constants.DIRECTION_Y_MOVE;
                return;
            }
            if (graX_ != 0) {
                controls.rotateDown(3 * Math.PI / 60 / 60 * graX_);
                /*controls.rotateLeft(4 * Math.PI / 60 / 60 * graY_);*/
                return;
            }
        } else {
            if (Math.abs(graX_) >= Math.abs(graY_) + 2.5) {
                moveDirect_ = GAME.Constants.DIRECTION_X_MOVE;
                return;
            }
            if (graY_ != 0) {
                controls.rotateLeft(3 * Math.PI / 60 / 60 * graY_);
                return;
            }
        }

        if (linearX_ == 0 && linearY_ == 0) {
            if (Math.abs(graX_) >= Math.abs(graY_) + 2) {
                moveDirect_ = GAME.Constants.DIRECTION_X_MOVE;
                return;
            }
            if (Math.abs(graY_) >= Math.abs(graX_) + 2) {
                moveDirect_ = GAME.Constants.DIRECTION_Y_MOVE;
                return;
            }
        }
    }

    function showText(x, y, x1, y1) {
        $('#msg').html('x:' + x + ' y:' + y + ' x1:' + x1 + ' y1:' + y1);
    }
}

GAME.gravity = new GAME.Gravity();
