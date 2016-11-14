import 'normalize.css'
import Wonder from './Arrow/Wonder'
import Pursuer from './Arrow/Pursuer'
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
objs.push(new Wonder())
for (let i = 0; i < 1; i += 1) {
  const pursuer = new Pursuer()
  pursuer.setTarget(objs[0])
  objs.push(pursuer)
}

let last = Date.now()
setInterval(() => {
  const now = Date.now()
  const dt = (now - last) / 1000
  last = now
  objs.forEach(item => item.update(dt, { canvas }))
}, 10)


const r = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  objs.forEach(item => item.render(ctx))
  renderTarget(target)
  requestAnimationFrame(r)
}
r()


canvas.onclick = e => target.copy({ x: e.x, y: e.y })

