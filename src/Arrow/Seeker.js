import Base from './Base'

export default class Seeker extends Base {
  seek(target) {
    const { position, maxSpeed, velocity } = this
    const desiredVelocity = target.clone().subtract(position).norm().scale(maxSpeed)
    return desiredVelocity.clone().subtract(velocity)
  }

  setTarget(target) {
    this.target = target
  }

  originUpdate(...args) {
    super.update(...args)
  }

  update(dt) {
    this.steering = this.seek(this.target)
    this.originUpdate.update(dt)
  }
}
