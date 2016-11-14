import Victor from 'victor'

export default class Vector extends Victor {
  scale(scalar) {
    return this.multiply(new Victor(scalar, scalar))
  }

  clone() {
    return new Vector(this.x, this.y)
  }

  setAngle(angle) {
    const length = this.length()
    return this.copy(
      new Vector(
        Math.cos(angle) * length,
        Math.sin(angle) * length
      )
    )
  }

  truncate(max) {
    if (this.length() <= max) {
      return this
    }
    return this.norm().multiply({ x: max, y: max })
  }
}
