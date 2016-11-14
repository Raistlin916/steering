import Base from './Base'

export default class Arrival extends Base {
  update(dt, target) {
    const { position, maxSpeed, velocity } = this
    const desiredVelocity = target.clone().subtract(position).norm().scale(maxSpeed)
    this.steering = desiredVelocity.clone().subtract(velocity)

    super.update(dt)
  }
}
