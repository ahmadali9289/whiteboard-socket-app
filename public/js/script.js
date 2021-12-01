let socket = io.connect("http://localhost:8080")
let canvas = document.getElementById("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let ctx = canvas.getContext("2d")

let x;
let y;
isMouseDown = false;

socket.on('ondraw', ({x, y}) => {
    ctx.lineTo(x, y)
    ctx.stroke()
})

socket.on('ondown', ({x, y}) => {
    ctx.moveTo(x, y)
})

window.onmousedown = () => {
    socket.emit('down', {x, y})
    ctx.moveTo(x, y)
    isMouseDown = true
}

window.onmouseup = () => {
    isMouseDown = false
}

window.onmousemove = (e) => {
    x = e.clientX;
    y = e.clientY;

    if (isMouseDown) {
        socket.emit('draw', { x, y })
        ctx.lineTo(x, y)
        ctx.stroke()
    }

}