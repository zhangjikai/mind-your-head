/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-7-27
 * Time: 下午8:18
 */
window.onload = function () {
    GAME.SharedVar.gameMode = parseInt(localStorage.getItem('gameMode'));
    console.log(GAME.SharedVar.gameMode);
    GAME.SharedVar.gameType = parseInt(localStorage.getItem('gameType'));

    GAME.SharedVar.gravity = parseInt(localStorage.getItem('gravity'));
    console.log(GAME.SharedVar.gravity);
    GAME.SharedVar.sound = parseInt(localStorage.getItem('sound'));
    GAME.SharedVar.music = parseInt(localStorage.getItem('music'));
    if(!localStorage.getItem('gameStage')) {
        localStorage.setItem('gameStage', 0);
    }

    if (GAME.SharedVar.gameMode == GAME.Constants.SINGLE_MODE) {
        GAME.gameStart.init();
        GAME.gameStart.animate();
        if (GAME.SharedVar.gameType == GAME.Constants.GRADE_MODE)
            GAME.Manager.startSingleGame(parseInt(localStorage.getItem('gameStage')),
                GAME.gameStart.getCamera(), GAME.gameStart.getScene());
        if (GAME.SharedVar.gameType == GAME.Constants.SCORE_MODE)
            GAME.Manager.startScoreGame(GAME.gameStart.getCamera(), GAME.gameStart.getScene());
    }
    if (GAME.SharedVar.gameMode == GAME.Constants.FIGHT_MODE) {
        GAME.Server.initialize();
    }

    var laseLeft = localStorage.getItem('laserLeft') || 10;
    var snowLeft = localStorage.getItem('snowLeft') || 10;
    var bumbLeft = localStorage.getItem('lightLeft') || 10;
    $('#laser_num').html(laseLeft);
    $('#snowflake_num').html(snowLeft);
    $('#lighting_num').html(bumbLeft);
    if(laseLeft <= 0) {
        GAME.operate.setLaserShoot(false);
    }
    if(snowLeft <= 0) {
        GAME.operate.setSnowShoot(false);
    }
    if(bumbLeft <= 0) {
        GAME.operate.setBumbShoot(false);
    }

    if (GAME.SharedVar.gravity) {
        document.getElementById("move").style.zIndex = "-1";
        document.getElementById("bullet").className = "bullet_ng";

        var lighting = document.getElementById("lighting");
        lighting.style.width = 9 + "%";
        lighting.style.height = 16 + "%";
        lighting.style.top = 80 + "%";
        lighting.style.left = 75 + "%";

        var snowflake = document.getElementById("snowflake");
        snowflake.style.width = 9 + "%";
        snowflake.style.height = 16 + "%";
        snowflake.style.top = 65 + "%";
        snowflake.style.left = 82.5 + "%";

        var laser = document.getElementById("laser");
        laser.style.width = 9 + "%";
        laser.style.height = 16 + "%";
        laser.style.top = 80 + "%";
        laser.style.left = 90 + "%";

        document.getElementById("snowflake_num").className="snowflake_num_g";
        document.getElementById("laser_num").className="laser_num_g";
        document.getElementById("lighting_num").className="lighting_num_g";
    } else {
        document.getElementById("move").style.opacity = 0.4;
        document.getElementById("bullet").className = "bullet_g";
        document.getElementById("snowflake_num").className="snowflake_num_ng";
        document.getElementById("laser_num").className="laser_num_ng";
        document.getElementById("lighting_num").className="lighting_num_ng";
    }
}

window.onbeforeunload = function () {
    GAME.gameStart.stop();
    GAME.Server.socket.close();
    window.location.href = 'server/logout';
}

