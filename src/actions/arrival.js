import { truncate } from '../utils'

export default ({ target, position, maxSpeed, velocity }) =>
  dt => {
    const desiredVelocity = target.clone().subtract(position).norm().scale(maxSpeed)
    const steering = desiredVelocity.clone().subtract(velocity)

    truncate(steering, maxSpeed)
    truncate(velocity.add(steering.clone().scale(dt)), maxSpeed)
    position.add(velocity.clone().scale(dt))
  }

