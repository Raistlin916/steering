import Vector from '../vector'
import { getRandom, truncate } from '../utils'

const CIRCLE_DISTANCE = 50
const CIRCLE_RADIUS = 150

const setAngle = (vector, angle) => {
  const length = vector.length()
  return vector.copy(
    new Vector(
      Math.cos(angle) * length,
      Math.sin(angle) * length
    )
  )
}

let wanderAngle = 0

const wander = velocity => {
  const circleCenter = velocity.clone().norm().scale(CIRCLE_DISTANCE)
  const displacement = new Vector(0, -CIRCLE_RADIUS)

  setAngle(displacement, wanderAngle)

  wanderAngle += getRandom(-0.5, 0.5)

  const wanderForce = circleCenter.add(displacement)
  return wanderForce
}

export default ({ position, maxSpeed, velocity }) =>
  dt => {
    const steering = wander(velocity, dt)

    truncate(steering, 10000)
    truncate(velocity.add(steering.clone().scale(dt)), maxSpeed)
    position.add(velocity.clone().scale(dt))
  }

