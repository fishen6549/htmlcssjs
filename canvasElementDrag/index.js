const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


const statusConfig = {
    IDLE: 0,
    DRAG_START: 1,
    DRAGGING: 2,
    
}

const canvasInfo = {
    status: statusConfig.IDLE,
    dragTarget: null,
    lastEvtPos: { x: null, y: null },
    lastEvtOffset: { x: null, y: null }
}


const circles = []

console.log(ctx);

drawCricle = (ctx, cx, cy, r) => {
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = 'blue'
    ctx.arc(cx, cy, r, 0, Math.PI * 2,)
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
}

drawCricle(ctx, 100, 100, 20)

circles.push({
    x: 100,
    y: 100,
    r: 20
})


const getCanvasPosition = (e) => {
    return {
        x: e.offsetX,
        y: e.offsetY
    }
}

const getDistance = (p1, p2) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

const ifInCircle = pos => {

    for (let i = 0; i < circles.length; i++) {
        // let distance = getDistance(pos, circles[i])
        if (getDistance(pos, circles[i]) < circles[i].r) {
            return circles[i]
        }
        return false;
    }
}

renderCircle = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < circles.length; i++) {
        drawCricle(ctx, circles[i].x, circles[i].y, circles[i].r)
    }
}


canvas.addEventListener('mousedown', e => {
    const pos = getCanvasPosition(e)
    const circle = ifInCircle(pos)

    if (circle) {
        canvasInfo.dragTarget = circle
        canvasInfo.status = statusConfig.DRAG_START
        canvasInfo.lastEvtPos = pos
        canvasInfo.lastEvtOffset = pos
    }
})


canvas.addEventListener('mousemove', e => {
    const pos = getCanvasPosition(e)
    if(ifInCircle(pos)){
        canvas.style.cursor = 'pointer'
    } else {
        canvas.style.cursor = ''
    }
    if (canvasInfo.status === statusConfig.DRAG_START && getDistance(pos, canvasInfo.lastEvtPos) > 5) {
        console.log('拖动状态');
        canvasInfo.status = statusConfig.DRAGGING
        canvasInfo.lastEvtOffset = pos

    } else if (canvasInfo.status === statusConfig.DRAGGING) {
        const { dragTarget } = canvasInfo
        dragTarget.x += pos.x - canvasInfo.lastEvtOffset.x
        dragTarget.y += pos.y - canvasInfo.lastEvtOffset.y
        renderCircle()
        canvasInfo.lastEvtOffset = pos;
    }
    // console.log('拖拽move');
})


canvas.addEventListener('mouseup', e => {
    if (canvasInfo.status === statusConfig.DRAGGING) {
        canvasInfo.status = statusConfig.IDLE
    }
})

canvas.addEventListener('mouseout',e=>{
    if (canvasInfo.status === statusConfig.DRAGGING) {
        canvasInfo.status = statusConfig.IDLE
    }
})
