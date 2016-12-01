import 'normalize.css'
import Vector from './Vector'

const width = 1000
const height = 1000

export default class World {
  constructor(onInit, onUpdate) {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    canvas.width = width
    canvas.height = height
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    this.target = new Vector(400, 400)
    canvas.onclick = e => {
      // if (this.target) {
      //   this.target = null
      //   return
      // }
      this.target = new Vector(e.x, e.y)
    }

    this.objs = []
    onInit(this.objs)
    this.onUpdate = onUpdate
  }

  renderTarget(position) {
    const { ctx } = this
    ctx.save()
    ctx.fillStyle = 'green'
    ctx.fillRect(position.x - 2.5, position.y - 2.5, 5, 5)
    ctx.restore()
  }

  run() {
    const { canvas, ctx } = this
    const r = () => {
      // this.ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.ctx.fillStyle = 'rgba(255,255,255,.2)'
      this.ctx.fillRect(0, 0, width, height)
      this.objs.forEach(item => item.render(ctx))
      this.target && this.renderTarget(this.target)
      requestAnimationFrame(r)
    }
    r()

    let last = Date.now()
    setInterval(() => {
      const now = Date.now()
      const dt = (now - last) / 1000
      last = now
      this.onUpdate(this.objs, this.target)
      this.objs.forEach(item => item.update && item.update(dt, { canvas, width, height }))
    }, 10)
  }
}
