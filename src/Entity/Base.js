import Vector from '../Vector'

export default class Base {
  constructor(position, velocity) {
    this.maxSpeed = 100
    this.maxForce = 1.5
    this.position = position || new Vector(0, 0)
    this.velocity = velocity || new Vector(0, 0)
  }

  getMaxSpeed() {
    return this.maxSpeed
  }

  getMaxForce() {
    return this.maxForce
  }

  getPosition() {
    return this.position.clone()
  }

  getVelocity() {
    return this.velocity.clone()
  }
}
