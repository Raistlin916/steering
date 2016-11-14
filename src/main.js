import 'normalize.css'
import wonder from './actions/wonder'
import Vector from './vector'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = 500
canvas.height = 500
const ctx = canvas.getContext('2d')

const renderPoint = (position, velocity) => {
  ctx.save()
  ctx.translate(position.x, position.y)
  const angle = velocity.angle()
  ctx.rotate(angle)

  ctx.beginPath()
  ctx.moveTo(20, 0)
  ctx.lineTo(-8, 8)
  ctx.lineTo(-8, -8)
  ctx.closePath()
  ctx.fillStyle = 'red'
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(20, 0)
  ctx.closePath()
  ctx.strokeStyle = 'white'
  ctx.stroke()
  ctx.restore()
}

const renderTarget = position => {
  ctx.save()
  ctx.fillStyle = 'green'
  ctx.fillRect(position.x - 2.5, position.y - 2.5, 5, 5)
  ctx.restore()
}




const maxSpeed = 100
const target = new Vector(400, 400)
const position = new Vector(200, 200)
const velocity = new Vector(0, 0)

const update = wonder({ maxSpeed, position, target, velocity })

let last = Date.now()
setInterval(() => {
  const now = Date.now()
  const dt = (now - last) / 1000
  last = now
  update(dt)
}, 10)


const r = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  renderPoint(position, velocity)
  renderTarget(target)
  requestAnimationFrame(r)
}
r()


canvas.onclick = e => target.copy({ x: e.x, y: e.y })

