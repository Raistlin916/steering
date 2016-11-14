import World from './World'
import Arrow from './Arrow'

const onInit = objs => {
  objs.push(new Arrow())
}

const onUpdate = (objs, target) => {
  objs.forEach(item => {
    if (target) {
      item.steering.seek(target)
    } else {
      item.steering.wander()
    }
  })
}

const world = new World(onInit, onUpdate)
world.run()
