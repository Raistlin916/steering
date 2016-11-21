import World from './World'
import Arrow from './Entity/Arrow'
import Obstacle from './Entity/Obstacle'
import Vector from './Vector'
import Path from './Entity/Path'


const ships = []
ships.push(new Arrow(new Vector(0, 0)))
ships.push(new Arrow(new Vector(50, 0)))
ships.push(new Arrow(new Vector(100, 0)))
ships.push(new Arrow(new Vector(150, 0)))
ships.push(new Arrow(new Vector(350, 400)))
ships.push(new Arrow(new Vector(300, 400)))

const obstacles = []
obstacles.push(new Obstacle(new Vector(100, 100), 20))
obstacles.push(new Obstacle(new Vector(200, 100), 30))
obstacles.push(new Obstacle(new Vector(200, 200), 40))
obstacles.push(new Obstacle(new Vector(100, 160), 20))


const path = new Path()
path.add(new Vector(20, 20))
path.add(new Vector(80, 30))
path.add(new Vector(30, 100))
path.add(new Vector(200, 70))
path.add(new Vector(200, 170))

const onInit = objs => {
  objs.push(new Obstacle(new Vector(100, 100), 20))
  objs.push(new Obstacle(new Vector(200, 100), 30))
  objs.push(new Obstacle(new Vector(200, 200), 40))
  objs.push(new Obstacle(new Vector(100, 160), 20))

  obstacles.forEach(item => objs.push(item))
  ships.forEach(item => objs.push(item))
  objs.push(path)
}

const onUpdate = (objs, target) => {
  // if (target) {
  //   ship.steering.seek(target)
  // } else {
  //   ship.steering.wander()
  // }
  ships.forEach(item => item.steering.walkOn(path))
  ships.forEach(item => item.steering.collisionAvoidance(obstacles))
}

const world = new World(onInit, onUpdate)
world.run()
