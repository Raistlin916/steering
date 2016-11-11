import 'normalize.css'
import Vector from 'victor'
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

const maxVelocity = new Vector(100, 100)
const maxSpeed = 100
const target = new Vector(200, 300)
const position = new Vector(100, 50)
const mass = new Vector(100, 100)
const velocity = new Vector(20, 20)


const update = dt => {
  dt = new Vector(dt, dt)
  const desiredVelocity = target.clone().subtract(position).norm().multiply(maxVelocity)
  const steering = desiredVelocity.clone().subtract(velocity)

  truncate(steering, maxSpeed).divide(mass)

  truncate(velocity.add(steering), maxSpeed)
  position.add(velocity.clone().multiply(dt))
}


let last = Date.now()
setInterval(() => {
  const now = Date.now()
  const dt = (now - last) / 1000
  last = now
  update(dt)
}, 5)


const r = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  renderPoint(position)
  renderTarget(target)
  requestAnimationFrame(r)
}
r()


canvas.onclick = e => target.copy({ x: e.x, y: e.y })

