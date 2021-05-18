const canvas = document.querySelector('#canvas')
// canvas.width = 400
// canvas.height = 400
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext('2d')

// rect = { x: 100, y: 100, width: 200, height: 200 }
rects = [{ x: 100, y: 100, width: 200, height: 200 }, { x: 350, y: 100, width: 50, height: 50 }]
scale = 1
preScale = 1
scaleStep = 0.1
lastPos = { x: null, y: null }
canvasOffset = { x: 0, y: 0 }



drawRect = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < rects.length; i++) {
        // drawRect(rects[i])
        const rect = rects[i]
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = "#FF7782"
        ctx.globalAlpha = 0.3
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ctx.closePath()
        ctx.restore()
    }

}

scaleRect = () => {
    for (let i = 0; i < rects.length; i++) {
        // drawRect(rects[i])
        const rect = rects[i]
        const realPos = {
            x: lastPos.x - rect.x,//图形相对于鼠标的偏移数 
            y: lastPos.y - rect.y
        }
        console.log(realPos);

        const offsetX = realPos.x * (scale - preScale) / preScale
        const offsetY = realPos.y * (scale - preScale) / preScale
        rect.x -= offsetX
        rect.y -= offsetY
        // rect.width = rect.width * scale
        // rect.height = rect.height * scale
        // rect.width = rect.width * scaleStep + rect.width
        // rect.height = rect.height * scaleStep + rect.height
        // rect.width = rect.width * (scale - preScale) + rect.width
        // rect.height = rect.height * (scale - preScale) + rect.height
        rect.width = rect.width * (scale / preScale)
        rect.height = rect.height * (scale / preScale)
    }

}

getPosition = (e) => {
    return {
        x: e.offsetX,
        y: e.offsetY
    }
}

drawRect()


canvas.addEventListener('wheel', e => {
    e.preventDefault()
    console.log(e);
    lastPos = getPosition(e)
    const realPos = {
        x: lastPos.x - canvasOffset.x,//画布的偏移数 
        y: lastPos.y - canvasOffset.y
    }
    preScale = scale
    if (e.wheelDelta < 0) {
        console.log('缩小');
        scale -= scaleStep
    } else if (e.wheelDelta > 0) {
        console.log('放大');
        scale += scaleStep
    }
    const offsetX = realPos.x * (scale - preScale) / preScale
    const offsetY = realPos.y * (scale - preScale) / preScale
    console.log(scale);
    // console.log(offsetX, offsetY);
    canvasOffset.x -= offsetX
    canvasOffset.y -= offsetY
    console.log(canvasOffset);
    scaleRect()
    drawRect()
})