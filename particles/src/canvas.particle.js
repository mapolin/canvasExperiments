function Particle(x, y, radius, velocity, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dampening = 0.01;
    this.stopped = false;
    this.hit = false;

    if(typeof velocity != 'object') {
        var velocity = {x: velocity, y: velocity};
    }

    this.velocity = {
        x: velocity.x,
        y: velocity.y,
        saved: {
            x: velocity.x,
            y: velocity.y
        },
        invert: function(axis) {
            if(axis) {
                this[axis] *= -1;
                return;
            }
            this.x *= -1;
            this.y *= -1;
        }
    };

    this.slow = function() {
        if(Math.abs(this.velocity.x) <= 0 && Math.abs(this.velocity.y <= 0)) {
            this.stopped = true;
            return;
        }

        this.velocity.x -= this.velocity.x * this.dampening;
        this.velocity.y -= this.velocity.y * this.dampening; 
    };

    this.speed = function() {
        if(Math.abs(this.velocity.x) >= this.velocity.saved.x && Math.abs(this.velocity.y) >= this.velocity.saved.y) {
            this.hit = false;
            return;
        }

        if(Math.abs(this.velocity.x) < this.velocity.saved.x) {
            this.velocity.x += this.velocity.x * this.dampening;
        }
        if(Math.abs(this.velocity.y) < this.velocity.saved.y) {
            this.velocity.y += this.velocity.y * this.dampening;
        }
    }

    this.process = function() {
        if(this.hit === true) {
            this.slow();
        }
        if(this.hit === 1) {
            this.speed();
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };

    this.reset = function(delay) {
        var tP = this;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function() {
            tP.hit = 1;
            tP.dampening = 0.01;
            tP.process();
            clearTimeout(tP.timeout);
        }, delay)
    };
    
    return this;
};