import Base from './Base'
import SteeringManager from '../components/SteeringManager'

export default class Arrow extends Base {
  constructor(position, velocity) {
    super(position, velocity)
    this.bgColor = 'red'
    this.steering = new SteeringManager(this)
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

    ctx.fillStyle = 'blue'
    ctx.fillRect(-1, -1, 2, 2)
    ctx.restore()
  }

  update(dt) {
    const force = this.steering.get()
    this.steering.update(dt)
    const { velocity, maxSpeed, maxForce, position } = this
    force.truncate(maxForce)
    velocity.add(force.scale(dt)).truncate(maxSpeed)
    position.add(velocity.clone().scale(dt))
    return this
  }
}
