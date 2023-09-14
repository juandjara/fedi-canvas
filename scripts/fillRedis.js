const { Redis } = require('ioredis')

const REDIS_URL = process.env.REDIS_URL
const redis = new Redis(
  REDIS_URL,
  { family: 6 }
)
redis.on('error', err => {
  console.error('Redis error: ', err)
})

async function fillRedis() {
  const WIDTH = 500
  const HEIGHT = 500
  const COLOR_CHANNELS = 4

  const data = new Uint8ClampedArray(WIDTH * HEIGHT * COLOR_CHANNELS)
  console.log(`putting ${data.length} bytes into Redis`)
  for (let i = 0; i < data.length; i += COLOR_CHANNELS) {
    data[i] = Math.floor(Math.random() * 256) // R
    data[i + 1] = Math.floor(Math.random() * 256) // G
    data[i + 2] = Math.floor(Math.random() * 256) // B
    data[i + 3] = 255 // A
  }

  await redis.set('canvas', Buffer.from(data))
  console.log('operation complete')
}

fillRedis().then(() => redis.quit()).catch(console.error)
