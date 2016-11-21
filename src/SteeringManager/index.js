import Vector from '../Vector'
import { getRandom } from '../utils'

const CIRCLE_DISTANCE = 50
const CIRCLE_RADIUS = 150
const MAX_AVOID_FORCE = 1000
const MAX_SEE_AHEAD = 10

function lineIntersectsCircle(pt, pt2, pt3, obstacle) {
  const obstaclePosition = obstacle.getPosition()
  const { radius } = obstacle

  return obstaclePosition.distance(pt) <= radius ||
      obstaclePosition.distance(pt2) <= radius ||
      obstaclePosition.distance(pt3) <= radius
}

export default class SteeringManager {
  constructor(host) {
    this.steering = new Vector(0, 0)
    this.wanderAngle = 0
    this.host = host
    this.lastDt = 0
  }

  wander() {
    const velocity = this.host.getVelocity()
    const { wanderAngle } = this
    const circleCenter = velocity.norm().scale(CIRCLE_DISTANCE)
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
    const position = this.host.getPosition()
    const velocity = this.host.getVelocity()
    const maxSpeed = this.host.getMaxSpeed()
    const maxForce = this.host.getMaxForce()

    const desired = targetPosition.clone().subtract(position)
    const distance = desired.length()
    const slowingPercent = Math.min(distance / slowingRadius, 1)
    desired.scale(maxSpeed * slowingPercent)
    return desired.subtract(velocity).truncate(maxForce)
  }

  flee(targetPosition) {
    this.steering.add(this.doFlee(targetPosition))
    return this
  }

  doFlee(targetPosition) {
    const position = this.host.getPosition()
    const velocity = this.host.getVelocity()
    const maxSpeed = this.host.getMaxSpeed()
    const maxForce = this.host.getMaxForce()

    const desired = position.subtract(targetPosition)
    desired.scale(maxSpeed)
    return desired.subtract(velocity).truncate(maxForce)
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
    const position = this.host.getPosition()
    const maxSpeed = this.host.getMaxSpeed()

    const updatesNeeded = position.distance(target.position) / maxSpeed
    return target.position.clone()
          .add(target.velocity.clone().scale(dt * updatesNeeded))
  }

  collisionAvoidance(obstacles) {
    const ahead = this.getAhead()

    let avoidance = new Vector(0, 0)
    const obstacle = this.findClonestObstacle(obstacles)

    if (obstacle) {
      avoidance = ahead.subtract(obstacle.getPosition()).norm().scale(MAX_AVOID_FORCE)
    }

    this.steering.add(avoidance)
    return this
  }

  getAhead(p = 1) {
    const position = this.host.getPosition()
    const velocity = this.host.getVelocity()
    const maxSpeed = this.host.getMaxSpeed()

    const percent = velocity.length() / maxSpeed
    return position.clone().add(velocity.norm().scale(MAX_SEE_AHEAD * p))
  }

  findClonestObstacle(obstacles) {
    const position = this.host.getPosition()
    const ahead = this.getAhead()
    const ahead2 = this.getAhead(0.5)
    const ahead3 = this.getAhead(0)
    let clonestObstacle = null

    obstacles.forEach(item => {
      const collision = lineIntersectsCircle(ahead, ahead2, item)
      if (collision &&
        (!clonestObstacle ||
          item.getPosition().distance(position) <
            clonestObstacle.getPosition().distance(position)
          )) {
        clonestObstacle = item
      }
    })
    return clonestObstacle
  }

  get() {
    return this.steering.clone()
  }

  update(dt) {
    this.lastDt = dt
    this.steering = new Vector(0, 0)
  }
}
