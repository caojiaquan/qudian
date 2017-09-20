const fs = require('fs');


// fs.readFile('demo5.js',callback);
//普通函数转换为thunk函数
function thunk(fn) {
    return function(...args){
        return function(callback){
            return fn.call(this, ...args, callback);
        }
    }
}


fs.readFile(fileName, function(err , data){

});



var thunkder = thunk(fs.readFile);
console.log(thunkder);
function* gen(){
    var aa =  yield thunkder('demo5.js');
    var bb = yield thunkder('demo5.js');
}


function run(fn) {
    var gen = fn();
    function next(err, data) {
        var result = gen.next(data);
        if (result.done) return;
        console.log(result.value);
        result.value(next);
    }
    next();
}
run(gen);



