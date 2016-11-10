export default {
  debounce: (() => {
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
  })(),
  getRandomInt: (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min
}
