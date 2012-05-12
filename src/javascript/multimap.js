/* 

MultiMap.js
 - Creates a hashmap that allows many values to be stored against it.
 - Key/Values can be of any object type
 - Inspired by post: http://stackoverflow.com/questions/368280/javascript-hashmap-equivalent

*/

function MultiMap() {
    this.size = 0;
}

MultiMap.prototype.get = function(key) {
    var item = this[key];
    return item === undefined ? undefined : item;
};

// If key is not present, create new value array and add value.
// If key is present, add value to existing value array
MultiMap.prototype.put = function(key, value) {
    if(this[key] === undefined) {
      this[key] = [ value ];
      ++this.size;
    }
    else this[key].push( value );
    return this;
};

MultiMap.prototype.remove = function(key) {
    var item = this[key];
    if(item !== undefined) {
        --this.size;
        delete this[key];
    }
    return this;
};
