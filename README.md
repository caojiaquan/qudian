
generater函数：是异步式编程的一种解决方式，一种理解方式是它是一个状态机，里边封装了n多个状态

写法：function * gen(){
yield    bb();
}

调用方式：和普通函数一样，后边跟括号

返回值： 返回的是一个指向内部的指针变量，也就是iterator对象

机制：调用generater函数时，遇到yield就会暂停在这里，下一次进来可以接着执行，遇到第一个yield，他的next()方法返回的是一个对象{value: yield返回的值
， done: boolen标识遍历是否结束}

注：1.同样定义一个函数名相同的generater函数和普通函数不会重载，后定义的覆盖先定义的
    2. yield表达式只能用在generater函数内部，否则报错
    
任意对象的Symbol.interator属性都等于它的遍历器生成函数，调用该函数会返回一个遍历器对象，generater函数本身就是一个遍历器生成器，把generater函数赋值给对象的Symbol.interator属性，从而会使得对象具有iterator接口。
【next方法】可以有参数，且参数就是上一个yield的返回值，如果不传参数，上一个yield的方法返回的是undefined  第一个next通常不带参数，带了也会被v8引擎忽略

for...of循环：可以自动遍历函数生成的遍历器对象（iterater），而不需要去调用next方法
除了for of循环以外，扩展运算符(...)、解构赋值和array.from方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。
