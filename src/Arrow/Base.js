import Vector from '../Vector'

export default class Base {
  constructor() {
    this.maxSpeed = 100
    this.maxForce = 100
    this.position = new Vector(200, 200)
    this.velocity = new Vector(0, 0)
    this.bgColor = 'red'
  }

  render(ctx) {
    const { position, velocity } = this
    ctx.save()
    ctx.translate(position.x, position.y)
    const angle = velocity.angle()
    ctx.rotate(angle)

    ctx.beginPath()
    ctx.moveTo(20, 0)
    ctx.lineTo(-8, 8)
    ctx.lineTo(-8, -8)
    ctx.closePath()
    ctx.fillStyle = this.bgColor
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(20, 0)
    ctx.closePath()
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.restore()
  }

  update(dt, ...args) {
    const steering = this.getSteering(dt, ...args)
    const { velocity, maxSpeed, maxForce, position } = this
    steering.truncate(maxForce)
    velocity.add(steering.clone().scale(dt)).truncate(maxSpeed)
    position.add(velocity.clone().scale(dt))
    return this
  }

  getSteering() {
    return new Vector(0, 0)
  }
}
