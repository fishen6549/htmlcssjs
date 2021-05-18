const canvas = document.querySelector('#canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const src = './img/timg.jpg'

const ctx = canvas.getContext('2d')

const img = new Image()
img.onload = () => {
    // console.log(img);
    // console.log(img.width, img.height);
    // console.dir(img);
    imgInfo.width = img.width
    imgInfo.height = img.height
    imgInfo.originalWidth = img.width
    imgInfo.originalHeight = img.height
    imgInfo.x = 0
    imgInfo.y = 0
    fitZoom(img)
    ctx.drawImage(img, 0, 0, imgInfo.originalWidth, imgInfo.originalHeight, 0, 0, imgInfo.width, imgInfo.height)
}
img.src = src

let lineWidth = 2, radius = 4, cursorStr = ''

console.log(ctx);

const statusConfig = {
    IDLE: 0,
    DRAG_START: 1,
    DRAGGING: 2,
    NEW_RECT: 3,
    MOVE_RECT: 4,
    RESIZE_RECT: 5,
    SCALE: 6
}

const canvasInfo = {
    status: statusConfig.IDLE,
    dragTarget: null,
    lastEvtPos: { x: null, y: null },
    lastEvtOffset: { x: null, y: null },
    dragType: statusConfig.NEW_RECT,
    offsetMouseEvtPos: { x: null, y: null },
    offset: { x: 0, y: 0 },
    canvasMouseOffset: { x: null, y: null },
    scale: 1,
    preScale: 1,
    scaleStep: 0.1,
    maxScale: 5,
    minScale: 0.1
}
const imgInfo = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    originalWidth: 0,
    originalHeight: 0
}
const rects = []

const getCanvasPosition = (e, offset = { x: 0, y: 0 }, scale = 1) => {
    return {
        x: (e.offsetX - offset.x) / scale,
        y: (e.offsetY - offset.y) / scale
    }
}

const getMousePosition = e => {
    return {
        x: e.offsetX,
        y: e.offsetY
    }
}

const fitZoom = (img) => {
    const ratio = img.width / img.height

    if (canvas.width > canvas.height) {
        imgInfo.width = canvas.height * ratio
        imgInfo.height = canvas.height
    } else {
        imgInfo.width = canvas.width
        imgInfo.height = canvas.height * ratio
    }
    canvasInfo.scale = imgInfo.width / imgInfo.originalWidth
}


renderRect = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < rects.length; i++) {
        drawRect(rects[i])
    }

}

scaleRect = () => {
    for (let i = 0; i < rects.length; i++) {
        const rect = rects[i]
        const realPos = {
            x: canvasInfo.lastEvtPos.x - rect.x,//图形相对于鼠标的偏移数 
            y: canvasInfo.lastEvtPos.y - rect.y
        }
        const offsetX = realPos.x * (canvasInfo.scale - canvasInfo.preScale) / canvasInfo.preScale
        const offsetY = realPos.y * (canvasInfo.scale - canvasInfo.preScale) / canvasInfo.preScale
        rect.x -= offsetX
        rect.y -= offsetY
        rect.width = rect.width * (canvasInfo.scale / canvasInfo.preScale)
        rect.height = rect.height * (canvasInfo.scale / canvasInfo.preScale)
    }
    renderRect()
}

scaleImg = () => {
    const realPos = {
        x: canvasInfo.lastEvtPos.x - imgInfo.x,//图形相对于鼠标的偏移数 
        y: canvasInfo.lastEvtPos.y - imgInfo.y
    }
    const offsetX = realPos.x * (canvasInfo.scale - canvasInfo.preScale) / canvasInfo.preScale
    const offsetY = realPos.y * (canvasInfo.scale - canvasInfo.preScale) / canvasInfo.preScale
    imgInfo.x -= offsetX
    imgInfo.y -= offsetY
    imgInfo.width = imgInfo.width * (canvasInfo.scale / canvasInfo.preScale)
    imgInfo.height = imgInfo.height * (canvasInfo.scale / canvasInfo.preScale)
    ctx.drawImage(img, 0, 0, imgInfo.originalWidth, imgInfo.originalHeight, imgInfo.x, imgInfo.y, imgInfo.width, imgInfo.height)
}



drawRect = (rect) => {
    ctx.save()
    ctx.beginPath()

    ctx.fillStyle = "#FF7782"
    ctx.globalAlpha = 0.3

    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.closePath()
    ctx.restore()
}


const getPoint = (a, b, step) => [
    a - step,
    a + step,
    a + b - step,
    a + b + step
]
inRect = (pos) => {
    for (let i = 0; i < rects.length; i++) {

        // if (pos.x > rects[i].x && pos.x < rects[i].x + rects[i].width && pos.y > rects[i].y && pos.y < rects[i].y + rects[i].height) {
        if (pos.x > rects[i].x - lineWidth && pos.x < rects[i].x + rects[i].width + lineWidth && pos.y > rects[i].y - lineWidth && pos.y < rects[i].y + rects[i].height + lineWidth) {
            console.log('在方形内', rects[i]);
            return rects[i]
        }
    }
    console.log('不在方形内');
    return null
}

drawRectBorder = (rect) => {
    // renderRect()
    const pointList = [//左上 右上 左下 右下
        { x: rect.x, y: rect.y },
        { x: rect.x + rect.width, y: rect.y },
        { x: rect.x, y: rect.y + rect.height },
        { x: rect.x + rect.width, y: rect.y + rect.height }
    ]
    ctx.beginPath()
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    // ctx.rect(zoomX(rect.x), zoomY(rect.y), zoom(rect.width), zoom(rect.height));
    ctx.strokeStyle = "#FF7782"
    ctx.lineWidth = lineWidth
    ctx.globalAlpha = 1
    ctx.stroke()
    ctx.closePath()

    pointList.forEach(item => {
        ctx.beginPath()
        ctx.arc(
            item.x,
            item.y,
            // zoomX(item.x),
            // zoomY(item.y),
            radius,
            0,
            Math.PI * 2
        )
        ctx.fillStyle = '#fff'
        ctx.fill()
        ctx.strokeStyle = "#FF7782"
        ctx.lineWidth = 2
        ctx.globalAlpha = 1
        ctx.stroke()
        ctx.closePath()
    })
}


let timer;
function throttle(fn, wait = 50, context = null) {
    return (...args) => {
        // console.log(timer);
        if (!timer) {
            // console.log(timer);
            timer = setTimeout(() => {
                clearTimeout(timer)
                fn.apply(context, args)
                timer = null;
            }, wait);
            // console.log(timer);
        }
    }
}

let timeout;
function debounce(fn, wait = 50, context = null) {
    return (...args) => {
        // console.log(timeout);
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            clearTimeout(timeout)
            fn.apply(context, args)
            timeout = null;
        }, wait);
    }
}


changeCursor = (pos) => {
    // console.log(pos);
    const getPoint = (a, b, step) => [
        a - step,
        a + step,
        a + b - step,
        a + b + step
    ]
    const rect = canvasInfo.dragTarget

    let tLine = { x: rect.x + radius, y: rect.y - radius, width: rect.width - 2 * radius, height: 2 * radius }
    let bLine = { x: rect.x + radius, y: rect.y - radius + rect.height, width: rect.width - 2 * radius, height: 2 * radius }
    let lLine = { x: rect.x - radius, y: rect.y + radius, width: 2 * radius, height: rect.height - 2 * radius }
    let rLine = { x: rect.x - radius + rect.width, y: rect.y + radius, width: 2 * radius, height: rect.height - 2 * radius }
    const points = [tLine, bLine, lLine, rLine]
    console.log('移动');

    if (pos.x > tLine.x && pos.x < tLine.x + tLine.width) {//上下
        if (pos.y > tLine.y && pos.y < tLine.y + tLine.height || pos.y > bLine.y && pos.y < bLine.y + bLine.height) {
            document.body.style.cursor = 's-resize'
            return
        }
    }

    if (pos.y > lLine.y && pos.y < lLine.y + lLine.height) {//左右
        if (pos.x > lLine.x && pos.x < lLine.x + lLine.width || pos.x > rLine.x && pos.x < rLine.x + rLine.width) {
            document.body.style.cursor = 'e-resize'
            // console.log('s-resize');
            return
        }
    }
    if (pos.x > lLine.x && pos.x < lLine.x + lLine.width) {
        if (pos.y > tLine.y && pos.y < tLine.y + tLine.height) {
            document.body.style.cursor = 'se-resize'
            return
        }
        if (pos.y > bLine.y && pos.y < bLine.y + bLine.height) {
            document.body.style.cursor = 'sw-resize'
            return
        }
    }
    document.body.style.cursor = 'auto'
    // console.log(x, y, width, height)
    // ctx.save()
    // ctx.beginPath()
    // ctx.fillStyle = "blue"
    // ctx.globalAlpha = 1
    // ctx.fillRect(tLine[0], tLine[1], tLine[2], tLine[3])
    // ctx.closePath()
    // ctx.restore()
}


changeCursor1 = (pos) => {
    // console.log(pos);
    // const getPoint = (a, b, step) => [
    //     a - step,
    //     a + step,
    //     a + b - step,
    //     a + b + step
    // ]
    if (!canvasInfo.dragTarget) {
        return
    }
    if (canvasInfo.status === statusConfig.DRAGGING && canvasInfo.dragType === statusConfig.RESIZE_RECT) {
        return
    }
    const rect = canvasInfo.dragTarget
    const { x, y } = pos
    const xLine = getPoint(rect.x, rect.width, lineWidth)
    const yLine = getPoint(rect.y, rect.height, lineWidth)
    const xCircle = getPoint(rect.x, rect.width, radius)
    const yCircle = getPoint(rect.y, rect.height, radius)
    const move =
        x > xLine[1] && x < xLine[2] && y > yLine[1] && y < yLine[2]
    const lLine = x > xLine[0] && x < xLine[1] && y > yLine[1] && y < yLine[2]
    const rLine = x > xLine[2] && x < xLine[3] && y > yLine[1] && y < yLine[2]
    const tLine = y > yLine[0] && y < yLine[1] && x > xLine[1] && x < xLine[2]
    const bLine = y > yLine[2] && y < yLine[3] && x > xLine[1] && x < xLine[2]
    const ltCircle =
        x > xCircle[0] &&
        x < xCircle[1] &&
        y > yCircle[0] &&
        y < yCircle[1]
    const lbCircle =
        x > xCircle[0] &&
        x < xCircle[1] &&
        y > yCircle[2] &&
        y < yCircle[3]
    const rtCircle =
        x > xCircle[2] &&
        x < xCircle[3] &&
        y > yCircle[0] &&
        y < yCircle[1]
    const rbCircle =
        x > xCircle[2] &&
        x < xCircle[3] &&
        y > yCircle[2] &&
        y < yCircle[3]

    canvasInfo.dragType = statusConfig.RESIZE_RECT
    if (ltCircle) {
        document.body.style.cursor = 'se-resize'
        cursorStr = 'ltCircle'
    } else if (lbCircle) {
        document.body.style.cursor = 'sw-resize'
        cursorStr = 'lbCircle'
    } else if (rtCircle) {
        document.body.style.cursor = 'sw-resize'
        cursorStr = 'rtCircle'
    } else if (rbCircle) {
        document.body.style.cursor = 'se-resize'
        cursorStr = 'rbCircle'
    } else if (lLine) {
        console.log('lLine', lLine);
        document.body.style.cursor = 'e-resize'
        cursorStr = 'lLine'
    } else if (rLine) {
        document.body.style.cursor = 'e-resize'
        cursorStr = 'rLine'
    } else if (tLine) {
        document.body.style.cursor = 's-resize'
        cursorStr = 'tLine'
    } else if (bLine) {
        document.body.style.cursor = 's-resize'
        cursorStr = 'bLine'
    } else if (move) {
        document.body.style.cursor = 'move'
        cursorStr = 'move'
    } else {
        // console.log('不在边框范围内default');
        document.body.style.cursor = 'default'
        // canvasInfo.dragType = statusConfig.NEW_RECT
    }

    // if (canvasInfo.status === statusConfig.DRAGGING) {
    //     resizeRect(pos, cursorStr)
    // }
}

resizeRect = (pos, cursorStr) => {
    // console.log('开始变换');
    const rect = canvasInfo.dragTarget
    const { x, y } = pos
    // const [deltaX, deltaY] = [x - canvasInfo.lastEvtPos.x, y - canvasInfo.lastEvtPos.x]

    const [deltaX, deltaY] = [x - canvasInfo.lastEvtOffset.x, y - canvasInfo.lastEvtOffset.y]
    // console.log(deltaX, deltaY);
    // console.log('开始变换,', cursorStr, deltaX, deltaY, rect, canvasInfo.lastEvtOffset);
    switch (cursorStr) {
        case 'move':
            rect.x += deltaX
            rect.y += deltaY
            break
        case 'lLine':
            rect.x += deltaX
            rect.width -= deltaX
            break
        case 'rLine':
            rect.width += deltaX
            break
        case 'tLine':
            rect.y += deltaY
            rect.height -= deltaY
            break
        case 'bLine':
            rect.height += deltaY
            break
        case 'ltCircle':
            rect.x += deltaX
            rect.y += deltaY
            rect.width -= deltaX
            rect.height -= deltaY
            break
        case 'lbCircle':
            rect.x += deltaX
            rect.width -= deltaX
            rect.height += deltaY
            break
        case 'rtCircle':
            rect.y += deltaY
            rect.width += deltaX
            rect.height -= deltaY
            break
        case 'rbCircle':
            rect.width += deltaX
            rect.height += deltaY
            break
        case 'revise':

            break
    }
}






canvas.addEventListener('mousedown', e => {
    const pos = getMousePosition(e)
    canvasInfo.status = statusConfig.DRAG_START
    canvasInfo.lastEvtPos = pos
    canvasInfo.lastEvtOffset = pos
    canvasInfo.dragTarget = inRect(pos)
    changeCursor1(pos)

    if (canvasInfo.dragTarget) {
        canvasInfo.dragType = statusConfig.MOVE_RECT;
    } else {
        console.log('NEW_RECT');
        canvasInfo.dragType = statusConfig.NEW_RECT;
    }
    renderRect()
})

canvas.addEventListener('mousemove', e => {
    const pos = getMousePosition(e)//有选中的矩形则需要改变鼠标样式
    if (canvasInfo.status === statusConfig.IDLE) {
        if (!canvasInfo.dragTarget) {
            return
        } else {
            changeCursor1(pos)
        }
    } else if (canvasInfo.status === statusConfig.DRAG_START) {
        canvasInfo.status = statusConfig.DRAGGING
        canvasInfo.lastEvtOffset = pos

    } else if (canvasInfo.status === statusConfig.DRAGGING) {
        if (canvasInfo.dragType === statusConfig.NEW_RECT) {
            if (canvasInfo.dragTarget) {
                canvasInfo.dragTarget.width = e.offsetX - canvasInfo.lastEvtPos.x
                canvasInfo.dragTarget.height = e.offsetY - canvasInfo.lastEvtPos.y
            } else {
                const rect = { x: canvasInfo.lastEvtPos.x, y: canvasInfo.lastEvtPos.y, width: e.offsetX - canvasInfo.lastEvtPos.x, height: e.offsetX - canvasInfo.lastEvtPos.x }
                rects.push(rect)
                canvasInfo.dragTarget = rect
            }
        } else if (canvasInfo.dragType === statusConfig.MOVE_RECT || canvasInfo.dragType === statusConfig.RESIZE_RECT) {
            changeCursor1(pos)
            resizeRect(pos, cursorStr)
            canvasInfo.lastEvtOffset = pos;
        }
        renderRect()
    }
})

canvas.addEventListener('wheel', e => {
    e.preventDefault()
    console.log(e);
    canvasInfo.preScale = canvasInfo.scale
    const pos = getMousePosition(e)
    canvasInfo.lastEvtPos = pos
    // const realPos = getMousePosition(e)
    canvasInfo.status = statusConfig.SCALE
    realPos = {//
        x: pos.x - canvasInfo.offset.x,
        y: pos.y - canvasInfo.offset.y
    }
    console.log("画布坐标", realPos);
    canvasInfo.canvasMouseOffset = realPos
    const { scaleStep } = canvasInfo
    // const deltaX = realPos.x / canvasInfo.scale * scaleStep 25*1.1-25 25*1.5-25
    // const deltaY = realPos.y / canvasInfo.scale * scaleStep  25/1*0.1 
    const deltaX = Math.floor(realPos.x / canvasInfo.scale * scaleStep)
    const deltaY = Math.floor(realPos.y / canvasInfo.scale * scaleStep)
    // console.log('delteX', deltaX, 'deltaY', deltaY);
    if (e.deltaY < 0 && canvasInfo.scale < canvasInfo.maxScale) {//放大
        canvasInfo.offset.x -= deltaX
        canvasInfo.offset.y -= deltaY
        // canvasInfo.scale += scaleStep
        canvasInfo.scale = parseFloat((canvasInfo.scale + canvasInfo.scaleStep).toFixed(2))
        // console.log(canvasInfo.offset);
        // canvasInfo.lastEvtPos = realPos
        // scaleRect()
        console.log(canvasInfo.scale);
    } else if (e.deltaY >= 0 && canvasInfo.scale > canvasInfo.minScale) {//缩小
        canvasInfo.offset.x += deltaX
        canvasInfo.offset.y += deltaY
        // canvasInfo.scale -= scaleStep
        // canvasInfo.scale -= scaleStep
        canvasInfo.scale = parseFloat((canvasInfo.scale - canvasInfo.scaleStep).toFixed(2))
        // console.log(canvasInfo.offset);
        console.log(canvasInfo.scale);
        // canvasInfo.lastEvtPos = realPos
        // scaleRect()
    }
    scaleRect()
    scaleImg()
    canvasInfo.status = statusConfig.IDLE
    // ctx.setTransform(canvasInfo.scale, 0, 0, canvasInfo.scale, canvasInfo.offset.x, canvasInfo.offset.y)
    // renderCircle()


})

canvas.addEventListener('mouseup', e => {
    // if (canvasInfo.status === statusConfig.DRAGGING || canvasInfo.status === statusConfig.IDLE) {
    // console.log('鼠标抬起');
    canvasInfo.status = statusConfig.IDLE
    // canvasInfo.dragTarget = null;
    // }
})

canvas.addEventListener('mouseout', e => {
    if (canvasInfo.status === statusConfig.DRAGGING || canvasInfo.status === statusConfig.IDLE) {
        canvasInfo.status = statusConfig.IDLE
    }
})