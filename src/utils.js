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

const getRandom = (min, max) =>
  Math.random() * (max - min) + min

export {
  debounce,
  getRandomInt,
  getRandom
}
