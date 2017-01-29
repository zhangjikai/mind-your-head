/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-7
 * Time: 下午9:48
 */
GAME.WaitHelper = function () {
    var intervalId = 0;

    this.showWaiting = function () {
        $('#game').css({
            display: "none"
        });
        $('#gameWating').css({
            display: 'block'
        });
        intervalId = window.setInterval(changeStyle, 1000);
    }

    var count = 0;
    function changeStyle() {
        document.getElementById('text').className = 'text-' + count;
        count = (count + 1) % 5;
    }

    this.hiddenWaiting = function () {
        $('#game').css({
            display: "block"
        });
        $('#gameWating').css({
            display: 'none'
        });
        window.clearInterval(intervalId);
    }
}

GAME.waitHelper = new GAME.WaitHelper();