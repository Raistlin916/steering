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

    this.seek(behind, 50)
    this.separation(entities)

    return this
  }

  isOnLeaderSight(leader, leaderAhead) {
    const position = this.host.getPosition()
    return leaderAhead.distance(position) <= LEADER_SIGHT_RADIUS ||
      leader.getPosition().distance(position) <= LEADER_SIGHT_RADIUS
  }

  separation(entities) {
    const position = this.host.getPosition()
    const force = new Vector(0, 0)
    let neighborCount = 0

    entities.forEach(item => {
      if (item === this.host) {
        return
      }
      const itemPosition = item.getPosition()
      if (position.distance(itemPosition) < SIGHT_RADIUS) {
        force.add(itemPosition.subtract(position))
        neighborCount += 1
      }
    })
    if (neighborCount) {
      force.scale(-1 / neighborCount)
    }

    this.steering.add(force)
    return this
  }
}
