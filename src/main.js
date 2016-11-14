import 'normalize.css'
import Arrow from './Arrow/Wonder'
import Vector from './Vector'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = 500
canvas.height = 500
const ctx = canvas.getContext('2d')

const renderTarget = position => {
  ctx.save()
  ctx.fillStyle = 'green'
  ctx.fillRect(position.x - 2.5, position.y - 2.5, 5, 5)
  ctx.restore()
}

const target = new Vector(400, 400)
const objs = []
for (let i = 0; i < 10; i += 1) {
  objs.push(new Arrow())
}

let last = Date.now()
setInterval(() => {
  const now = Date.now()
  const dt = (now - last) / 1000
  last = now
  objs.forEach(item => item.update(dt, target))
}, 10)


const r = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  objs.forEach(item => item.render(ctx))
  renderTarget(target)
  requestAnimationFrame(r)
}
r()


canvas.onclick = e => target.copy({ x: e.x, y: e.y })

