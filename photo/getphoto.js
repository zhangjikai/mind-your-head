/**
 * Created with JetBrains WebStorm. User: zhangjk Date: 13-9-6 Time: 下午7:19
 */

var width = 0;
var height = 0;
var left = 0;
function setSize() {
    width = window.innerWidth;
    height = window.innerHeight;

    var canvas = document.getElementById('canvas');
    canvas.width = width * 0.8;
    canvas.height = height;
    canvas.style.left = width * 0.1 + 'px';
    var tCanvas = document.getElementById('tCanvas');
    tCanvas.width = width * 0.8;
    tCanvas.height = height;
    tCanvas.style.left = width * 0.1 + 'px';
    var video = document.getElementById('video');
    left = width * 0.2;
    video.style.left = width * 0.2 + 'px';
    video.width = width * 0.6;
    video.height = height;

    var confirm = document.getElementById('confirm');
    confirm.style.top = height * 0.7 + 'px';
    /*confirm.style.right = width * 0.08 + 'px';*/
    confirm.style.width = width * 0.15 + 'px';
    confirm.style.height = height * 0.1 + 'px';
    var cancel = document.getElementById('cancel');
    cancel.style.top = height * 0.85 + 'px';
    cancel.style.width = width * 0.15 + 'px';
    cancel.style.height = height * 0.1 + 'px';

    var canvas = document.getElementById('tCanvas');
    var context = canvas.getContext("2d");
    drawLines(context, canvas.width, canvas.height);

}

window.addEventListener('resize', setSize, false);

function getVideo() {
    var video = document.getElementById('video'), videoObj = {
        "video": true
    }, errBack = function (error) {
        console.log("Video capture error: ", error.code);
    };
    // Put video listeners into place
    navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    navigator.getMedia(
        // constraints
        {
            video: true
        },
        // successCallback
        function (stream) {
            if (video.mozSrcObject !== undefined) {
                video.mozSrcObject = stream;
            } else {
                video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
            }
            video.onloadedmetadata = function (e) {
                video.play();
            };
        },
        // errorCallback
        function (err) {
            console.log("The following error occured: " + err);
        });
}

function addListener() {

    $('#canvas').click(picture);
    $('#tCanvas').click(picture);
    $('#video').click(picture);
    $('#confirm').click(function () {
    	if(!hasDraw)
    		drawHead();
        var canvas = document.getElementById('canvas');

        var num = localStorage.num;
        if (num === undefined) {
            num = localStorage.num = '1';
        }
        localStorage.removeItem(num);
        num = parseInt(num) + 1 + '';
        localStorage.num = num;
        localStorage.setItem(num, canvas.toDataURL("image/png"));

        var flag = confirm('是否上传服务器');
        if (flag) {
            document.getElementById('imageData').value = canvas.toDataURL("image/png");
            document.getElementById('form').submit();
        } else {
            window.location.href = 'testPhoto.html';
        }
    });
    $('#cancel').click(function () {
        window.location.href = "../index.html";
    });
}

function drawHead(){
	 var canvas = document.getElementById('canvas');
	 var tCanvas = document.getElementById('tCanvas');
	 var context = canvas.getContext('2d');
     var tContext = tCanvas.getContext('2d');
     var video = document.getElementById('video');
     context.drawImage(video, width * 0.1, height*0.01, width * 0.6, height * 0.98);
     document.getElementById('video').style.display = "none";
     canvas.style.zIndex = 4;
     drawLines(tContext, canvas.width, canvas.height);
}

var count = 0;
var hasDraw = false;
function picture() {
    var canvas = document.getElementById('canvas');
    var tCanvas = document.getElementById('tCanvas');
    if (count++ % 2 == 0) {
        var context = canvas.getContext('2d');
        var tContext = tCanvas.getContext('2d');
        var video = document.getElementById('video');
        context.drawImage(video, width * 0.1, height*0.01, width * 0.6, height * 0.98);
        document.getElementById('video').style.display = "none";
        canvas.style.zIndex = 4;
        drawLines(tContext, canvas.width, canvas.height);
        hasDraw = true;
    } else {
        canvas.width = width * 0.8;
        canvas.style.zIndex = 4;
        document.getElementById("video").style.display = "block";
        var tCanvas = document.getElementById('tCanvas');
        var tContext = canvas.getContext("2d");
        drawLines(tContext, tCanvas.width, tCanvas.height);
        hasDraw = false;
    }
}

function drawLines(context, width, height) {
    context.lineWidth = 5;
    context.strokeStyle = "red";
    context.lineCap = "round";

    context.beginPath();
    context.moveTo(width * 0.38, height * 0.39);
    context.lineTo(width * 0.45, height * 0.39);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(width * 0.55, height * 0.39);
    context.lineTo(width * 0.62, height * 0.39);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(width * 0.45, height * 0.7);
    context.lineTo(width * 0.55, height * 0.7);
    context.stroke();
    context.closePath();
}

function preventDefaultScroll(event) {
    event.preventDefault();
    /*window.scrollTo(0, 1);*/
    return false;
};

window.onload = function () {
    setSize();
    getVideo();
    addListener();
    document.addEventListener('touchmove', preventDefaultScroll, false);
}
