import Vector from '../Vector'
import SteeringManager from './SteeringManager'

const SIGHT_RADIUS = 50
const LEADER_BEHIND_DIST = 50
const LEADER_SIGHT_RADIUS = 50

export default class BoidSteeringManager extends SteeringManager {

  followLeader(leader, entities) {
    const tv = leader.getVelocity().norm().scale(LEADER_BEHIND_DIST)
    const ahead = leader.getPosition().add(tv)
    const behind = leader.getPosition().add(tv.scale(-1))

    if (this.isOnLeaderSight(leader, ahead)) {
      this.evade(leader)
    }

    return [
      this.seek(behind, 50),
      this.separate(entities),
      this.align(entities),
      this.cohesion(entities)
    ]
  }

  flock(entities) {
    return [
      this.separate(entities).scale(2),
      this.align(entities),
      this.cohesion(entities)
    ]
  }

  isOnLeaderSight(leader, leaderAhead) {
    const position = this.host.getPosition()
    return leaderAhead.distance(position) <= LEADER_SIGHT_RADIUS ||
      leader.getPosition().distance(position) <= LEADER_SIGHT_RADIUS
  }

  separate(entities) {
    const position = this.host.getPosition()
    const mean = new Vector()
    let count = 0

    entities.forEach(boid => {
      const d = position.distance(boid.getPosition())
      if (d > 0 && d < 10) {
        mean.add(position.subtract(boid.getPosition()).norm().scale(1 / d))
        count += 1
      }
    })

    if (count > 0) {
      mean.scale(1 / count)
    }

    return mean;
  }

  align(entities) {
    const maxForce = this.host.getMaxForce()
    const position = this.host.getPosition()
    const mean = new Vector()
    let count = 0
    entities.forEach(boid => {
      const d = position.distance(boid.getPosition());
      if (d > 0 && d < SIGHT_RADIUS) {
        mean.add(boid.getVelocity())
        count += 1
      }
    })

    if (count > 0) {
      mean.scale(1 / count)
    }
    return mean.truncate(maxForce)
  }

  cohesion(entities) {
    const position = this.host.getPosition()
    const sum = new Vector(0, 0)
    let count = 0

    entities.forEach(boid => {
      const d = position.distance(boid.getPosition())
      if (d > 0 && d < SIGHT_RADIUS) {
        sum.add(boid.getPosition())
        count += 1
      }
    })

    if (count > 0) {
      return this.steerTo(sum.scale(1 / count))
    }
    return sum
  }

  steerTo(target) {
    const position = this.host.getPosition()
    const maxSpeed = this.host.getMaxSpeed()
    const maxForce = this.host.getMaxForce()
    const velocity = this.host.getVelocity()
    const desired = target.subtract(position)
    const d = desired.length()
    let steer

    if (d > 0) {
      desired.norm();
      if (d < 100) {
        desired.scale(maxSpeed * (d / 100))
      } else {
        desired.scale(maxSpeed)
      }
      steer = desired.subtract(velocity)
      steer.truncate(maxForce)
    } else {
      steer = new Vector(0, 0)
    }

    return steer;
  }

}
