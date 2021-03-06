function Promise(executor) {
    this.callbacks = []
    this.promiseState = 'pending'
    this.promiseResult = null
    const self = this

    function resolve(data) {
        if (self.promiseState !== 'pending') return
        self.promiseState = 'fulfilled'
        self.promiseResult = data
        self.callbacks.forEach(item => {
            if (item.onResolve) {
                item.onResolve(data)
            }
        })
    }

    function reject(data) {
        if (self.promiseState !== 'pending') return
        self.promiseState = 'rejected'
        self.promiseResult = data
        // if(self.callback.onReject){
        //     self.callback.onReject(data)
        // }
        self.callbacks.forEach(item => {
            if (item.onReject) {
                item.onReject(data)
            }
        })
    }
    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

Promise.prototype.then = function (onResolve, onReject) {//then 传入两个回调函数 一个成功函数 一个失败函数
    const self = this
    return new Promise((resolve, reject) => {
        function callback(type) {
            try {
                //onResolve(this.promiseResult)
                let result = type(self.promiseResult)//执行成功的回调函数结果
                if (result instanceof Promise) {//如果返回的是一个Promise对象
                    result.then(v => {
                        resolve(v)
                    }, r => {
                        reject(v)
                    })
                } else {
                    resolve(result)
                }
            } catch (e) {
                reject(e)
            }
        }
        //没有return的话结果就算undefined
        if (this.promiseState === 'fulfilled') {//同步完成
            callback(onResolve)
        }
        if (this.promiseState === 'rejected') {//同步拒绝
            callback(onReject)
        }
        if (this.promiseState === 'pending') {//异步
            //    this.callback.push(onResolve)
            //    this.callback.push(onReject)
            // this.callbacks = {
            //     onResolve,onReject
            // }

            this.callbacks.push({ //异步情况下保存所有的回调函数 
                onResolve() {//执行成功的回调函数
                    callback(onResolve)
                },
                onReject() {
                    callback(onReject)
                }
            })
        }
    })

}