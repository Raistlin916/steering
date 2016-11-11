import 'normalize.css'
import Vector from './vector'
import { truncate } from './utils'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = 500
canvas.height = 500
const ctx = canvas.getContext('2d')

const renderPoint = position => {
  ctx.save()
  ctx.beginPath()
  ctx.arc(position.x, position.y, 5, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = 'red'
  ctx.fill()
  ctx.restore()
}

const renderTarget = position => {
  ctx.save()
  ctx.fillStyle = 'green'
  ctx.fillRect(position.x - 5, position.y - 5, 5, 5)
  ctx.restore()
}

const maxSpeed = 100
const target = new Vector(400, 400)
const position = new Vector(200, 200)
const velocity = new Vector(100, 20)



const update = dt => {
  const desiredVelocity = target.clone().subtract(position).norm().scale(maxSpeed)

  const dist = target.clone().subtract(position).length()
  const percent = dist / 200
  if (percent < 1) {
    desiredVelocity.scale(percent)
  }
  const steering = desiredVelocity.clone().subtract(velocity)

  truncate(steering, maxSpeed)

  truncate(velocity.add(steering.clone().scale(dt * 10)), maxSpeed)

  position.add(velocity.clone().scale(dt))
}


let last = Date.now()
setInterval(() => {
  const now = Date.now()
  const dt = (now - last) / 1000
  last = now
  update(dt)
}, 10)


const r = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  renderPoint(position)
  renderTarget(target)
  requestAnimationFrame(r)
}
r()


canvas.onclick = e => target.copy({ x: e.x, y: e.y })

