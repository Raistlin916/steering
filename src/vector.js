import Victor from 'victor'

export default class Vector extends Victor {
  scale(scalar) {
    return this.multiply(new Victor(scalar, scalar))
  }

  clone() {
    return new Vector(this.x, this.y)
  }
}
