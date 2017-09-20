const fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

function run(fn) {
    var gen = fn();

    function next(err, data) {
        var result = gen.next(data);
        console.log(data);
        if (result.done) return;
        result.value(next);
    }

    next();
}

function* g() {
   yield readFileThunk('demo1.html');
   yield readFileThunk('demo3.html');

}

run(g);