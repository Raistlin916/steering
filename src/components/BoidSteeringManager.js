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
      this.separate(entities),
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
    const maxForce = this.host.getMaxForce()
    const maxSpeed = this.host.getMaxSpeed()
    const velocity = this.host.getVelocity()
    const steer = new Vector(0, 0)
    let neighborCount = 0

    entities.forEach(item => {
      if (item === this.host) {
        return
      }
      const itemPosition = item.getPosition()
      const dist = position.distance(itemPosition)
      if (dist > 0 && dist < SIGHT_RADIUS / 2) {
        const diff = position.subtract(itemPosition).norm().scale(1 / dist)
        steer.add(diff)
        neighborCount += 1
      }
    })
    if (neighborCount) {
      steer
        .scale(1 / neighborCount)
    }
    if (steer.length() > 0) {
      steer.norm()
        .scale(maxSpeed)
        .subtract(velocity)
        .truncate(maxForce)
        .scale(1.5)
    }
    return steer
  }

  align(entities) {
    const position = this.host.getPosition()
    const velocity = this.host.getVelocity()
    const maxForce = this.host.getMaxForce()
    const maxSpeed = this.host.getMaxSpeed()
    const sum = new Vector(0, 0)
    let neighborCount = 0

    entities.forEach(item => {
      if (item === this.host) {
        return
      }
      const itemPosition = item.getPosition()
      const dist = position.distance(itemPosition)
      if (dist > 0 && dist < SIGHT_RADIUS) {
        sum.add(item.getVelocity())
        neighborCount += 1
      }
    })
    if (neighborCount) {
      sum.scale(1 / neighborCount)
        .norm()
        .scale(maxSpeed)
      const steer = sum.subtract(velocity).truncate(maxForce)
      return steer
    }
    return new Vector(0, 0)
  }

  cohesion(entities) {
    const position = this.host.getPosition()
    const desiredPosition = new Vector(0, 0)
    let neighborCount = 0

    entities.forEach(item => {
      if (item === this.host) {
        return
      }
      const itemPosition = item.getPosition()
      const dist = position.distance(itemPosition)
      if (dist > 0 && dist < SIGHT_RADIUS) {
        desiredPosition.add(item.getPosition())
        neighborCount += 1
      }
    })
    if (neighborCount) {
      desiredPosition.scale(1 / neighborCount)
      return this.seek(desiredPosition)
    }
    return new Vector(0, 0)
  }

}
