var canvas, ctx, stats;
var frame = 0, currentColor, _C, _flag, stopped = false;

window.onload = init;

function init() {
    PutCanvas();
    document.getElementById('kaboom').addEventListener('click', function() {
        stopped = (stopped) ? false : true;
        if(stopped) return false;
        
        window.cancelAnimationFrame(animation);
        animation = window.requestAnimationFrame(Animate);
    }, false);
}

function PutCanvas() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    
    canvas.id = 'kaboom';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    stats = document.createElement('div');
    stats.id = 'stats';
    stats.style.position = 'absolute';
    stats.style.top = 0;
    stats.style.left = 0;
    stats.style.width = '140px';
    stats.style.height = '20px';
    stats.style.padding = '10px 0';
    stats.style.font = '14px #000 Calibri';
    stats.style.textAlign = 'center';
    stats.style.background = '#fefefe';
    stats.style.borderRight = stats.style.borderBottom = '1px solid #333';
    stats.style.borderRadius = '0 0 10px 0';
    stats.style.boxShadow = '1px 1px 2px rgba(0, 0, 0, .3)';
    
    document.body.appendChild(stats);
    
    _C = 0;
    _flag = true;
    
    Color();
    Animate();
}

function Color(color) {
    currentColor = (color) ? color : 'rgb(0, 0, 0)';
    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function Change(color) {
    var increment = (_flag) ? 5 : -5;
    
    if( (color[_C] < 255 && _flag) || (color[_C] > 0 && !_flag) )
        color[_C] += increment;
    else
        _C++
    
    if(_C > 2) {
        if(_flag) {
            _flag = false;
        }
        else {
            _flag = true;
        }
        _C = 0;
    }
    
    return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
}

function Animate() {
    if(stopped) return;
    
    var color = currentColor.split(',');
    var newColor = [];
    
    color.each(function() {
        var c = this.replace(/[a-z, \(, \)]/g, '');
        c = parseInt(c);
        newColor.push(c);
    });
    
    newColor = Change(newColor);
    
    stats.innerHTML = newColor;
    Color(newColor);
    
    window.requestAnimationFrame(Animate);
}

var animation = window.requestAnimationFrame(Animate);