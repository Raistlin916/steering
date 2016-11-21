
export default class Path {
  constructor(nodes = []) {
    this.nodes = nodes
  }

  add(node) {
    this.nodes.push(node)
  }

  get(index) {
    return this.nodes[index]
  }

  length() {
    return this.nodes.length
  }

  render(ctx) {
    ctx.save()
    ctx.beginPath()
    this.nodes.forEach((item, index) => {
      if (index === 0) {
        ctx.moveTo(item.x, item.y)
      } else {
        ctx.lineTo(item.x, item.y)
      }
    })
    ctx.strokeStyle = 'gray'
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }
}
