window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

document.append = document.appendChild;

Array.prototype.each = function(fn) {
    for(var i = 0; i < this.length; i++) {
        fn.call(this[i]);
    }
};

Object.prototype.toInt = function() {
    return parseInt(this);
};

Object.equals = function( x, y ) {
  if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

  if ( x.constructor !== y.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

  for ( var p in x ) {
    if ( ! x.hasOwnProperty( p ) ) continue;
      // other properties were tested using x.constructor === y.constructor

    if ( ! y.hasOwnProperty( p ) ) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

    if ( x[ p ] === y[ p ] ) continue;
      // if they have the same strict value or identity then they are equal

    if ( typeof( x[ p ] ) !== "object" ) return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

    if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
      // Objects and Arrays must be tested recursively
  }

  for ( p in y ) {
    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
      // allows x[ p ] to be set to undefined
  }
  return true;
};

(function() {
  var h, s, c, sr, i;
  h = document.getElementsByTagName('head')[0]; s = document.getElementsByTagName('script');
  for(i in s) { if( s[i].src.indexOf('extends.js') ) s = s[i]; break; }
  sr = s.src.split('/'); sr = sr.splice(0, sr.length-1); sr = sr.join('/');
  c = document.createElement('script'); c.src = sr + '/cacher.js';
  h.insertBefore(c, s);
})();