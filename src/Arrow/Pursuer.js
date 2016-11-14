import Seeker from './Seeker'

export default class Pursuer extends Seeker {
  constructor(...args) {
    super(...args)
    this.bgColor = 'green'
  }

  getSteering(dt) {
    const targetPosition = this.pursuit(dt)
    return this.seek(targetPosition)
  }

  pursuit(dt) {
    const { target } = this
    const updatesNeeded = this.position.distance(target.position) / this.maxSpeed
    return target.position.clone().add(target.velocity.clone().scale(dt * updatesNeeded))
  }
}
