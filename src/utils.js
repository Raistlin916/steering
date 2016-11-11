import Vector from 'victor'

const debounce = (() => {
  let tid = null;
  return (fn, delay) => {
    if (tid) {
      return
    }
    tid = setTimeout(() => {
      tid = null
    }, delay)
    fn()
  };
})();

const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min

const truncate = (origin, max) => {
  if (origin.length() <= max) {
    return origin
  }
  return origin.norm().multiply({ x: max, y: max })
}

export {
  debounce,
  getRandomInt,
  truncate
}
