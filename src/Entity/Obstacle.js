import Base from './Base'

export default class Obstacle extends Base {
  constructor(position, radius) {
    super(position)
    this.radius = radius
  }

  render(ctx) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'pink'
    ctx.fill()
    ctx.restore()
  }
}
