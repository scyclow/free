// const PI = Math.PI
// const TWO_PI = Math.PI * 2
// const HALF_PI = Math.PI/2
// const QUARTER_PI = Math.PI/4
// const min = Math.min
// const max = Math.max
// const sin = Math.sin
// const cos = Math.cos
// const abs = Math.abs
// const atan2 = Math.atan2
// const dist = (x1, y1, x2, y2) => Math.sqrt(Math.abs(x1 - x2)**2 + Math.abs(y1 - y2)**2)


// const int = parseInt

// let __randomSeed = int(tokenData.hash.slice(50, 58), 16)
// function rnd(mn, mx) {
//   __randomSeed ^= __randomSeed << 13
//   __randomSeed ^= __randomSeed >> 17
//   __randomSeed ^= __randomSeed << 5
//   const out = (((__randomSeed < 0) ? ~__randomSeed + 1 : __randomSeed) % 1000) / 1000
//   if (mx != null) return mn + out * (mx - mn)
//   else if (mn != null) return out * mn
//   else return out
// }

function random(mn, mx) {
  const out = Math.random()
  if (mx != null) return mn + out * (mx - mn)
  else if (mn != null) return out * mn
  else return out
}

const rndint = (mn, mx) => int(random(mn, mx))
const prb = x => random() < x
const sample = (a) => a[int(random(a.length))]
const posOrNeg = () => prb(0.5) ? 1 : -1
const exists = x => !!x
const last = a => a[a.length-1]
const noop = () => {}

function times(t, fn) {
  const out = []
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}

function chance(...chances) {
  const total = chances.reduce((t, c) => t + c[0], 0)
  const seed = random()
  let sum = 0
  for (let i = 0; i < chances.length; i++) {
    const val =
      chances[i][0] === true ? 1
      : chances[i][0] === false ? 0
      : chances[i][0]
    sum += val / total
    if (seed <= sum && chances[i][0]) return chances[i][1]
  }
}


function setRunInterval(fn, ms, i=0) {
  const run = () => {
    fn(i)
    i++
  }

  run()

  return setInterval(run, ms)
}

// const lineStats = (x1, y1, x2, y2) => ({
//   d: dist(x1, y1, x2, y2),
//   angle: atan2(x2 - x1, y2 - y1)
// })

// function getXYRotation (deg, radius, cx=0, cy=0) {
//   return [
//     sin(deg) * radius + cx,
//     cos(deg) * radius + cy,
//   ]
// }

// const rndChar = () => sample('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))