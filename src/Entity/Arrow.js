import Base from './Base'
import Vector from '../Vector'
import { getRandom } from '../utils'
import BoidSteeringManager from '../components/BoidSteeringManager'

export default class Arrow extends Base {
  constructor(position, velocity, extra = {}) {
    if (!velocity) {
      const angle = getRandom(0, Math.PI * 2)
      velocity = new Vector(Math.sin(angle), Math.cos(angle))
      velocity.scale(100)
    }
    super(position, velocity)
    this.bgColor = 'red'
    this.steering = new BoidSteeringManager(this)
    this.debug = extra.debug
  }

  render(ctx) {
    const { position, velocity } = this
    ctx.save()
    ctx.translate(position.x, position.y)
    const angle = velocity.angle()
    ctx.rotate(angle)

    // ctx.beginPath()
    // ctx.moveTo(10, 0)
    // ctx.lineTo(-4, 4)
    // ctx.lineTo(-4, -4)
    // ctx.closePath()

    ctx.fillStyle = this.bgColor
    ctx.fillRect(-2, -2, 4, 4)
    ctx.fill()

    // ctx.beginPath()
    // ctx.moveTo(0, 0)
    // ctx.lineTo(10, 0)
    // ctx.closePath()
    // ctx.strokeStyle = 'white'
    // ctx.stroke()

    ctx.restore()
  }

  update(dt) {
    const force = this.steering.get()
    this.steering.update(dt)
    const { velocity, maxSpeed, position } = this
    velocity.add(force).truncate(maxSpeed)
    position.add(velocity.clone().scale(dt))
    return this
  }
}
