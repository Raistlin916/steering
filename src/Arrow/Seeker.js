import Base from './Base'

export default class Seeker extends Base {
  seek(target, slowingRadius = 20) {
    const { position, maxSpeed, velocity } = this
    const desired = target.clone().subtract(position)
    const distance = desired.length()
    desired.scale(maxSpeed * Math.min(distance / slowingRadius, 1))
    return desired.subtract(velocity)
  }

  flee(target, slowingRadius = 20) {
    const { position, maxSpeed, velocity } = this
    const desired = position.clone().subtract(target)
    const distance = desired.length()
    desired.scale(maxSpeed * Math.min(distance / slowingRadius, 1))
    return desired.subtract(velocity)
  }

  setTarget(target) {
    this.target = target
  }

  getSteering() {
    return this.seek(this.target)
  }
}
