import Seeker from './Seeker'

export default class Pursuer extends Seeker {
  constructor(...args) {
    super(...args)
    this.bgColor = 'green'
  }

  update(dt) {
    const { target } = this
    const targetPosition = target.position.clone().add(target.velocity.clone().scale(dt * 10))
    this.steering = this.seek(targetPosition)

    this.originUpdate(dt)
  }
}
