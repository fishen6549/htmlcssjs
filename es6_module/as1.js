// function A(callback) {
//     callback();
//     console.log('我是主函数');
// }

// //定义回调函数
// function B() {
//     setTimeout(() => console.log('hello world'), 0);//模仿耗时操作  
//     //console.log('我是B函数');
// }

// //调用主函数，将函数B传进去
// A(B);

// console.log("hello world");


async function timeout() {
    return 'hello world';
}