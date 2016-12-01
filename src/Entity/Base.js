import Vector from '../Vector'

export default class Base {
  constructor(position, velocity) {
    this.maxSpeed = 1
    this.maxForce = 0.03
    this.position = position || new Vector(0, 0)
    this.velocity = velocity || new Vector(0, 0)
    this.acc = new Vector(0, 0)
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

  applyForce(force) {
    if (Array.isArray(force)) {
      return force.reduce((a, b) => a.add(b), this.acc)
    }
    return this.acc.add(force)
  }
}
