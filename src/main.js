import World from './World'
import Arrow from './Entity/Arrow'
import Obstacle from './Entity/Obstacle'
import Vector from './Vector'
import Path from './Entity/Path'


const width = 640
const height = 360
const ships = []

for (let i = 0; i < 150; i += 1) {
  ships.push(new Arrow(new Vector(width / 2, height / 2), null, { debug: i === 0 }))
}

// const obstacles = []
// obstacles.push(new Obstacle(new Vector(100, 100), 20))
// obstacles.push(new Obstacle(new Vector(200, 100), 30))
// obstacles.push(new Obstacle(new Vector(200, 200), 40))
// obstacles.push(new Obstacle(new Vector(100, 160), 20))


// const path = new Path()
// path.add(new Vector(20, 20))
// path.add(new Vector(80, 30))
// path.add(new Vector(30, 100))
// path.add(new Vector(200, 70))
// path.add(new Vector(200, 170))

const onInit = objs => {
  ships.forEach(item => objs.push(item))
}


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
    item.applyForce(item.steering.flock(ships))
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
