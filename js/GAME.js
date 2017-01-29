/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-2
 * Time: 下午7:19
 */
var GAME = {}
GAME.preOrder = 0;

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();