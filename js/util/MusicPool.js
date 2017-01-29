
GAME.MusicPool=function(num){
    var size=num; // Max bullets allowed in the pool
    var pool = [];
    var currSound = 0;

    /*
     * Populates the pool array with the given object
     */
    this.init = function(object) {
        if (object == "laser") {
            for (var i = 0; i < size; i++) {
                // Initalize the object
                laser = new Audio("sounds/laser.ogg");
                laser.volume = .12;
                laser.load();
                pool[i] = laser;
            }
        }
        else if (object == "explosion") {
            for (var i = 0; i < size; i++) {
                var explosion = new Audio("sounds/explosion.ogg");
                explosion.volume = .1;
                explosion.load();
                pool[i] = explosion;
            }
        }
    };

    /*
     * Plays a sound
     */
    this.get = function() {
        if(pool[currSound].currentTime == 0 || pool[currSound].ended) {
            pool[currSound].play();
        }
        currSound = (currSound + 1) % size;
    };



}