function Cache(map) {
    this.map = map;
    
    this.__ID__ = 'cache-id-' + Math.floor(Math.random() * (new Date()).getMilliseconds());
    
    this.set = function(property, value) {
        if( typeof property == 'object' && !value ) {
            this.map = property;
        }
        else {
            this[property] = value;
        }
        
        this.update();
    };
    
    this.update = function() {
        if( !this.map ) return;
        
        if(typeof this.map != 'object')
            this.map = {'value': this.map};
        
        if(typeof this.map['__ID__'] != 'undefined' && this.map['__ID__'] != this.__ID__) {
            var cache = this.map.map;
            this.map = cache;
            cache = void(0);
        }

        if(typeof this.map == 'object') {
            if(this.map.constructor && this.map.constructor.name) {
                if(window.hasOwnProperty(this.map.constructor.name) && this.map.constructor.name.toLowerCase() != 'object') {
                    this[this.map.constructor.name] = this.map;
                    return;
                }
            }
        }

        for(var prop in this.map) {
            this[prop] = this.map[prop];
        }
    };

    this.clone = function() {
        var tmp = new Cache(this.map);
        return tmp;
    };
    
    this.clear = function() {
        for(var prop in this) {
            for(var m in this.map) {
                if(prop == m && this[prop] == this.map[m]) {
                    delete this[prop];
                }
            }
        }
        this.map = void(0);
    };

    this.cookie = function(name, expires) {
        var value = this.map;
        var name = name;
        var expr = new Date();
        expr.setDate( new Date().getDate() + expires );
        expr = expr.toUTCString();

        return name + '=' + value + ';expires=' + expr;
    };

    this.addCookie = function(name, expires) {
        document.cookie = this.cookie(name, expires);
    };
    
    this.update();
};