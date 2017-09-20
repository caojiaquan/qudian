/*
* 基于promise的自动执行函数
* */


const fs = require('fs');



function promise(fileName){
   return new Promise(function(resolve, reject){
       return fs.readFile(fileName, function(err, data){
           resolve(data);
       });
   });
}

function* gen(){
    var aa = yield promise('demo1.html');
    var bb = yield promise('demo1.html');

}


function run(gen){
    var g = gen();
    function next(data){
        var result = g.next(data);
        if (result.done) return result.value;
        result.value.then(function(data){
            next(data);
        });
    }
}