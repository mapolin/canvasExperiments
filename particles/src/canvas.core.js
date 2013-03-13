function Canvas(name) {
    this.name = name;
    this.particles = [];
    this.maxParticles = 5;
    this.STOP = false;
    this.spawn = {x: null, y: null};
    
    this.control();
    this.create();
    
    this.draw();
    
    return this;
};

Canvas.prototype.create = function() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    
    this.id = this.name;
    
    document.body.appendChild(this.canvas);
};

Canvas.prototype.clear = function() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    return true;
};

Canvas.prototype.control = function() {
    var _this = this;
    document.body.addEventListener('keyup', function(event) {
        if(event.keyCode == 27) {
            _this.STOP = true;
        }
        else if(event.keyCode == 32) {
            _this.STOP = false;
            _this.animate();
        }
    }, false);
    
    var spawnParticles = function(event) {
        //_this.spawn.x = event.clientX;
        //_this.spawn.y = event.clientY;

        if(_this.spawn.x < mouseCache.x)
            _this.createParticle({x: -5, y: 5});
        else
            _this.createParticle({x: 5, y: 5});

        mouseCache.x = event.clientX;
        mouseCache.y = event.clientY;
    };
    
    var mouseCache = new Cache();
    mouseCache.speedSpawn = null;
    document.body.addEventListener('mousemove', function() {
        _this.spawn.x = event.clientX;
        _this.spawn.y = event.clientY;
    }, false);
    document.body.addEventListener('mousedown', function(event) {
        mouseCache.set({x:0,y:0});
        mouseCache.x = event.clientX;
        mouseCache.y = event.clientY;
        
        //document.body.addEventListener('mousemove', spawnParticles, false);

        mouseCache.speedSpawn = setInterval(function() { spawnParticles(event) }, 0);

    }, false);
    document.body.addEventListener('mouseup', function(event) {
        clearInterval(mouseCache.speedSpawn);
        mouseCache.clear();
        document.body.removeEventListener('mousemove', spawnParticles);
    }, false)

    window.addEventListener('resize', function(event) {
        _this.canvas.width = window.innerWidth;
        _this.canvas.height = window.innerHeight;
    }, false);
};

Canvas.prototype.color = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    
    return 'rgb(' + r + ',' + g + ',' + b + ')';
};

Canvas.prototype.createParticle = function(velocity) {
    var x = (this.spawn.x) ? this.spawn.x : Math.floor(this.canvas.width * Math.random());
    var y = (this.spawn.y) ? this.spawn.y : Math.floor(this.canvas.height * Math.random());
    var radius = Math.floor(2 + Math.random()*16);
    var color = this.color();
    var velocity = (velocity) ? velocity : {x:5,y:5};
    var cP = new Particle(x, y, radius, velocity, color);
    
    this.particles.push(cP);
    
    return cP;
};

Canvas.prototype.removeParticle = function(particle) {
    var temp = [];
    
    for(var i = 0; i < this.particles.length; i++) {
        if( !Object.equals(particle, this.particles[i]) ) temp.push(this.particles[i]);
    }
    
    this.particles = temp;
};

Canvas.prototype.collide = function(particle) {
    for(var p = 0; p < this.particles.length; p++) {
        if(
            particle.x + particle.radius*2 > this.particles[p].x &&
            particle.y + particle.radius*2 > this.particles[p].y &&
            particle.x + this.particles[p].radius*2 < this.particles[p].x &&
            particle.y + this.particles[p].radius*2 < this.particles[p].y
        ) {
            this.removeParticle(particle);
            return false;
        }
    }
    return particle;
};

Canvas.prototype.boundry = function(particle) {
    var hit = false;
    if(particle.x + particle.radius > this.canvas.width || particle.x - particle.radius <= 0) {
        particle.velocity.invert('x');
        hit = true;
    }    
    if(particle.y + particle.radius > this.canvas.height || particle.y - particle.radius <= 0) {
        particle.velocity.invert('y');
        hit = true;
    }

    if(hit) {
        particle.dampening += 0.01;
        particle.hit = true;

        particle.reset(2500);
    }
        
    return particle;
};

Canvas.prototype.draw = function() {
    var p;
    
    this.ctx.strokeStyle = '#000';
    this.ctx.strokeWidth = '2';
    
    this.particle = p = this.createParticle();

    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
    
    this.ctx.fillStyle = p.color;
    
    this.ctx.fill();
    this.ctx.stroke();
    
    this.animate();
};

Canvas.prototype.animateParticle = function(particle) {
    particle.process();
    
    this.ctx.beginPath();
    
    this.ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI, false);
    
    this.ctx.fillStyle = particle.color;
    this.ctx.fill();
    this.ctx.stroke();

    if(this.particles.length > 1)
        particle = this.collide(particle);
    
    if(particle)
        particle = this.boundry(particle);
        
    return particle;
};

Canvas.prototype.animate = function() {
    if(this.STOP) return;
    
    var _this = this;

    this.clear();

    if( this.particles.length <= 1 )
        this.particle = this.animateParticle(this.particle);
    else {
        for(var p = 0; p < this.particles.length; p++) {
            this.particles[p] = this.animateParticle(this.particles[p]);
        }
    }
    
    this.anim = window.requestAnimFrame(function() {
        _this.animate();
    });
}
