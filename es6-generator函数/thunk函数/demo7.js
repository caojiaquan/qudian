
const fs = require('fs');
// const co = require('co');

var readFile = function (fileName) {
   return new Promise(function(resolve, reject){
       fs.readFile(fileName, function(err, data){
           if (err) return reject(err);
           resolve(data);
       });
   });
};

var gen = function* (){
    var f1 = yield readFile('demo1.html');
    var f2 = yield readFile('demo3.html');
    console.log(f1);
    console.log(f2);


};

//
// co(gen).then(function(){
//     console.log('函数执行完毕');
// });
//
// var g = gen();
//
//
// function co(gen){
//
//    var g = gen();
//    function next(data){
//        var result = g.next(data);
//        if (result.done) return result.value;
//        result.value.then(function(data){
//            next(data);
//        });
//    }
//    next();
//
// }
// g.next().value.then(function(err, data){
//     g.next(data).value.then(function(err, data){
//         g.next(data);
//     });
// });


function run(gen){
    var g = gen();
    function next(data){

        var result = g.next(data);

        if (result.done) return result.value;
        result.value.then(function(data){
            next(data);
        });
    }

    next();
}

run(gen);