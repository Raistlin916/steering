import Vector from '../Vector'
import { getRandom } from '../utils'

const CIRCLE_DISTANCE = 50
const CIRCLE_RADIUS = 150
const MAX_AVOID_FORCE = 30

function lineIntersectsCircle(pt, pt2, obstacle) {
  const obstaclePosition = obstacle.getPosition()
  const { radius } = obstacle

  return obstaclePosition.distance(pt) <= radius ||
    obstaclePosition.distance(pt2) <= radius
}

export default class SteeringManager {
  constructor(host) {
    this.wanderAngle = 0
    this.host = host
    this.lastDt = 0.01
    this.currentPointOnPath = 0
    this.pathDir = 1
  }

  wander() {
    const velocity = this.host.getVelocity()
    const { wanderAngle } = this
    const circleCenter = velocity.norm().scale(CIRCLE_DISTANCE)
    const displacement = new Vector(0, -CIRCLE_RADIUS)

    displacement.setAngle(wanderAngle)

    this.wanderAngle += getRandom(-0.5, 0.5)

    const wanderForce = circleCenter.add(displacement)
    return wanderForce
  }

  seek(targetPosition) {
    const position = this.host.getPosition()
    const maxSpeed = this.host.getMaxSpeed()
    const velocity = this.host.getVelocity()
    const maxForce = this.host.getMaxForce()

    const desired = targetPosition.subtract(position)
    const l = desired.length()
    if (l > 0) {
      desired.norm()
      if (l < 50) {
        desired.scale(maxSpeed * (l / 50))
      } else {
        desired.scale(maxSpeed)
      }
      const force = desired.subtract(velocity).truncate(maxForce)
      return force
    } else {
      return new Vector(0, 0)
    }

  }

  doSeek(targetPosition, slowingRadius = 50) {
    const position = this.host.getPosition()
    const velocity = this.host.getVelocity()
    const maxSpeed = this.host.getMaxSpeed()
    const maxForce = this.host.getMaxForce()

    const targetOffset = targetPosition.clone().subtract(position)
    const distance = targetOffset.length()
    const rampedSpeed = maxSpeed * (distance / slowingRadius)
    const clippedSpeed = Math.min(rampedSpeed, maxSpeed)
    const desiredVelocity = targetOffset.scale(clippedSpeed / distance)
    const steering = desiredVelocity.subtract(velocity)
    return steering.truncate(maxForce)
  }

  flee(targetPosition) {
    return this.doFlee(targetPosition)
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
    return force
  }

  evade(target) {
    const force = this.doFlee(this.getPredictPosition(target, this.lastDt))
    return force
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
    return avoidance
  }

  getAhead(p = 1) {
    const position = this.host.getPosition()
    const velocity = this.host.getVelocity()
    const maxSpeed = this.host.getMaxSpeed()

    return position.clone().add(velocity.norm().scale(maxSpeed * 0.1 * p))
  }

  findClonestObstacle(obstacles) {
    const position = this.host.getPosition()
    const ahead = this.getAhead()
    const ahead2 = this.getAhead(0.5)
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

  update(dt) {
    this.lastDt = dt
  }

  walkOn(path) {
    let currentPoint = path.get(this.currentPointOnPath)
    const position = this.host.getPosition()

    if (!path.get(this.pathDir + this.currentPointOnPath)) {
      this.pathDir *= -1
    }

    if (position.distance(currentPoint) < 10) {
      this.currentPointOnPath += this.pathDir
    }
    currentPoint = path.get(this.currentPointOnPath)

    return this.seek(currentPoint)
  }
}
