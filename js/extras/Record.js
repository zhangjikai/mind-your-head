/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-8
 * Time: 下午6:32
 */
/**
 * Created with JetBrains WebStorm.
 * User: zhangjk
 * Date: 13-9-8
 * Time: 下午6:32
 */
GAME.record = {
    save: function (num) {
        var length = 5;
        var item;
        while (length--) {
            if (!localStorage.getItem('record' + length)) {
                localStorage.setItem('record' + length, 0);
            }
        }

        length = 5;
        while (length--) {
            item = parseInt(localStorage.getItem('record' + length));
            if (num <= item) {
                break;
            }
        }
        length++;
        for (var i = 4; i > length; i--) {
            localStorage.setItem('record' + i, localStorage.getItem('record' + (i - 1)));
        }

        localStorage.setItem('record' + length, num);
    },

    get: function (index) {
        return localStorage.getItem('record' + index);
    },

    clear: function () {
        var length = 5;
        while (length--) {
            localStorage.setItem('record' + length, 0);
        }
    },

    check:function() {
        var length = 5;
        while (length--) {
            if (!localStorage.getItem('record' + length)) {
                localStorage.setItem('record' + length, 0);
            }
        }
    }
}