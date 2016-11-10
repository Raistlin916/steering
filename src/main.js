import 'normalize.css'
import Vector from 'victor'
import { truncate } from './utils'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = 500
canvas.height = 500
const ctx = canvas.getContext('2d')

const renderPoint = position => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.beginPath()
  ctx.arc(position.x, position.y, 5, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = 'red'
  ctx.fill()
  ctx.restore()
}

const maxVelocity = new Vector(10, 10)
const maxSpeed = 10
const target = new Vector(200, 300)
let position = new Vector(100, 50)
let velocity = new Vector(20, 20)


const update = () => {
  const desiredVelocity = target.clone().subtract(position).norm().multiply(maxVelocity)
  const steering = desiredVelocity.clone().subtract(velocity)

  velocity = truncate(velocity.clone().add(steering), maxSpeed)
  position.add(velocity)

  target.add({ x: 10, y: 0 })
}

setInterval(() => {
  update()
  renderPoint(position)
}, 100)