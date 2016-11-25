import World from './World'
import Arrow from './Entity/Arrow'
import Obstacle from './Entity/Obstacle'
import Vector from './Vector'
import Path from './Entity/Path'


const ships = []
ships.push(new Arrow(new Vector(0, 0), new Vector(10, 10)))
ships.push(new Arrow(new Vector(50, 0)))
ships.push(new Arrow(new Vector(100, 0)))
ships.push(new Arrow(new Vector(150, 0)))
ships.push(new Arrow(new Vector(350, 400)))
ships.push(new Arrow(new Vector(300, 400)))

ships.push(new Arrow(new Vector(250, 250), null, { debug: true }))

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

const width = 500
const height = 500

const onUpdate = (objs, target) => {
  // ships.forEach(item => {
  //   if (target) {
  //     item.steering.seek(target)
  //   } else {
  //     item.steering.wander()
  //   }
  // })
  // ships.forEach(item => item.steering.walkOn(path))

  // ships.forEach((item, index) => {
  //   if (index === 0) {
  //     item.steering.seek(target)
  //   } else {
  //     item.steering.followLeader(ships[0], ships)
  //   }
  // })

  ships.forEach(item =>
    item.steering.flock(ships)
  )

  // ships.forEach(item => item.steering.collisionAvoidance(obstacles))


  ships.forEach(item => {
    if (item.position.x < 0) {
      item.position.x += width
    }
    if (item.position.y < 0) {
      item.position.y += height
    }

    if (item.position.x > width) {
      item.position.x -= width
    }
    if (item.position.y > height) {
      item.position.y -= height
    }
  })
}

const world = new World(onInit, onUpdate)
world.run()
