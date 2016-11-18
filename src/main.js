import World from './World'
import Arrow from './Entity/Arrow'
import Obstacle from './Entity/Obstacle'
import Vector from './Vector'


let ship
let obstacles
const onInit = objs => {
  ship = new Arrow()

  objs.push(new Obstacle(new Vector(100, 160), 20))

  obstacles = objs.slice(0, 4)

  objs.push(ship)
}

const onUpdate = (objs, target) => {
  if (target) {
    ship.steering.seek(target)
  } else {
    ship.steering.wander()
  }
  ship.steering.collisionAvoidance(obstacles)
}

const world = new World(onInit, onUpdate)
world.run()
