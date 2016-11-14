import Vector from '../Vector'
import { getRandom } from '../utils'

const CIRCLE_DISTANCE = 50
const CIRCLE_RADIUS = 150

export default class SteeringManager {
  constructor(host) {
    this.steering = new Vector(0, 0)
    this.wanderAngle = 0
    this.host = host
    this.lastDt = 0
  }

  wander() {
    const { velocity } = this.host
    const { wanderAngle } = this
    const circleCenter = velocity.clone().norm().scale(CIRCLE_DISTANCE)
    const displacement = new Vector(0, -CIRCLE_RADIUS)

    displacement.setAngle(wanderAngle)

    this.wanderAngle += getRandom(-0.5, 0.5)

    const wanderForce = circleCenter.add(displacement)
    this.steering.add(wanderForce)
    return this
  }

  seek(targetPosition, slowingRadius = 10) {
    this.steering.add(this.doSeek(targetPosition, slowingRadius))
    return this
  }

  doSeek(targetPosition, slowingRadius) {
    const { position, maxSpeed, velocity } = this.host
    const desired = targetPosition.clone().subtract(position)
    const distance = desired.length()
    const slowingPercent = Math.min(distance / slowingRadius, 1)
    desired.scale(maxSpeed * slowingPercent)
    return desired.subtract(velocity)
  }

  flee(targetPosition) {
    this.steering.add(this.doFlee(targetPosition))
    return this
  }

  doFlee(targetPosition) {
    const { position, maxSpeed, velocity } = this.host
    const desired = position.clone().subtract(targetPosition)
    desired.scale(maxSpeed)
    return desired.subtract(velocity)
  }

  pursuit(target) {
    const force = this.doSeek(this.getPredictPosition(target, this.lastDt))
    this.steering.add(force)
    return this
  }

  evade(target) {
    const force = this.doFlee(this.getPredictPosition(target, this.lastDt))
    this.steering.add(force)
    return this
  }

  getPredictPosition(target, dt) {
    const updatesNeeded = this.host.position.distance(target.position) / this.host.maxSpeed
    return target.position.clone()
          .add(target.velocity.clone().scale(dt * updatesNeeded))
  }

  get() {
    return this.steering.clone()
  }

  update(dt) {
    this.lastDt = dt
    this.steering = new Vector(0, 0)
  }
}
