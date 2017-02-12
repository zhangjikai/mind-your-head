/**
 * Created by ZhangJikai on 2017/2/12.
 */
GAME.Device = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (GAME.Device.Android() || GAME.Device.BlackBerry() || GAME.Device.iOS() || GAME.Device.Opera() || GAME.Device.Windows());
    }
};