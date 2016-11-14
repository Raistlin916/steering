import Base from './Base'
import Vector from '../Vector'
import { getRandom } from '../utils'

const CIRCLE_DISTANCE = 50
const CIRCLE_RADIUS = 150

export default class Wonder extends Base {
  constructor(...args) {
    super(...args)
    this.wanderAngle = 0
  }

  getSteering(dt) {
    return this.wander(this.velocity, dt)
  }

  update(dt, { canvas }) {
    const { position } = this
    if (position.x < 0 || position.y < 0 ||
      position.x > canvas.width || position.y > canvas.height) {
      position.x = canvas.width / 2
      position.y = canvas.height / 2
    }
    super.update(dt, { canvas })
  }

  wander() {
    const { velocity, wanderAngle } = this
    const circleCenter = velocity.clone().norm().scale(CIRCLE_DISTANCE)
    const displacement = new Vector(0, -CIRCLE_RADIUS)

    displacement.setAngle(wanderAngle)

    this.wanderAngle += getRandom(-0.5, 0.5)

    const wanderForce = circleCenter.add(displacement)
    return wanderForce
  }
}

