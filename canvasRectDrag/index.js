const canvas = document.querySelector('#canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext('2d')

console.log(ctx);

const statusConfig = {
    IDLE: 0,
    DRAG_START: 1,
    DRAGGING: 2,
    NEW_RECT: 3,
    MOVE_RECT: 4,
}

const canvasInfo = {
    status: statusConfig.IDLE,
    dragTarget: null,
    lastEvtPos: { x: null, y: null },
    lastEvtOffset: { x: null, y: null },
    dragType: statusConfig.NEW_RECT
}

const rects = []

const getCanvasPosition = (e) => {
    return {
        x: e.offsetX,
        y: e.offsetY
    }
}

renderRect = () => {
    console.log(canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < rects.length; i++) {
        // drawRect(ctx, circles[i].x, circles[i].y, circles[i].r)
        drawRect(rects[i])
    }
}

drawRect = (rect) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.stroke();
    ctx.closePath()
    ctx.restore()
}

inRect = (pos) => {
    for (let i = 0; i < rects.length; i++) {
        // let distance = getDistance(pos, circles[i])
        if (pos.x > rects[i].x && pos.x < rects[i].x + rects[i].width && pos.y > rects[i].y && pos.y < rects[i].y + rects[i].height) {
            console.log('在方形内', rects[i]);
            canvasInfo.dragType = statusConfig.MOVE_RECT;
            return rects[i]
        }

    }
    console.log('不在方形内');
    canvasInfo.dragType = statusConfig.NEW_RECT;
    return false
}


canvas.addEventListener('mousedown', e => {
    const pos = getCanvasPosition(e)
    console.log(pos);
    canvasInfo.dragTarget = inRect(pos)
    canvasInfo.status = statusConfig.DRAG_START
    canvasInfo.lastEvtPos = pos
})

canvas.addEventListener('mousemove', e => {
    const pos = getCanvasPosition(e)
    if (canvasInfo.status === statusConfig.DRAG_START) {
        canvasInfo.status = statusConfig.DRAGGING
        canvasInfo.lastEvtOffset = pos

    } else if (canvasInfo.status === statusConfig.DRAGGING) {
        console.log(canvasInfo.lastEvtPos);
        console.log(e.offsetX - canvasInfo.lastEvtPos.x, e.offsetY - canvasInfo.lastEvtPos.y);
        // if (!canvasInfo.dragTarget) {

        // }
        // if (canvasInfo.dragTarget) {
        //     canvasInfo.dragTarget.width = e.offsetX - canvasInfo.lastEvtPos.x
        //     canvasInfo.dragTarget.height = e.offsetY - canvasInfo.lastEvtPos.y
        // } else {
        //     const rect = { x: canvasInfo.lastEvtPos.x, y: canvasInfo.lastEvtPos.y, width: e.offsetX - canvasInfo.lastEvtPos.x, height: e.offsetX - canvasInfo.lastEvtPos.x }
        //     rects.push(rect)
        //     canvasInfo.dragTarget = rect
        //     console.log(rects);
        // }

        if (canvasInfo.dragType === statusConfig.NEW_RECT) {
            if (canvasInfo.dragTarget) {
                canvasInfo.dragTarget.width = e.offsetX - canvasInfo.lastEvtPos.x
                canvasInfo.dragTarget.height = e.offsetY - canvasInfo.lastEvtPos.y
            } else {
                const rect = { x: canvasInfo.lastEvtPos.x, y: canvasInfo.lastEvtPos.y, width: e.offsetX - canvasInfo.lastEvtPos.x, height: e.offsetX - canvasInfo.lastEvtPos.x }
                rects.push(rect)
                canvasInfo.dragTarget = rect
                console.log(rects);
            }
        } else if (canvasInfo.dragType === statusConfig.MOVE_RECT) {
            // canvasInfo.dragTarget.x += e.offsetX - canvasInfo.lastEvtPos.x
            // canvasInfo.dragTarget.y += e.offsetY - canvasInfo.lastEvtPos.y
            canvasInfo.dragTarget.x += pos.x - canvasInfo.lastEvtOffset.x
            canvasInfo.dragTarget.y += pos.y - canvasInfo.lastEvtOffset.y
            canvasInfo.lastEvtOffset = pos;
        }
        renderRect()
        console.log(rects);
    }
})

canvas.addEventListener('mouseup', e => {
    // if (canvasInfo.status === statusConfig.DRAGGING || canvasInfo.status === statusConfig.IDLE) {
    console.log('鼠标抬起');
    canvasInfo.status = statusConfig.IDLE
    canvasInfo.dragTarget = null;
    // }
})

canvas.addEventListener('mouseout', e => {
    if (canvasInfo.status === statusConfig.DRAGGING || canvasInfo.status === statusConfig.IDLE) {
        canvasInfo.status = statusConfig.IDLE
    }
})