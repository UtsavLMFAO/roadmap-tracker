import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

// Simple pure Node PNG generator with RGBA buffer
function createPng(width, height, getPixel) {
  const rowBytes = width * 4 + 1
  const rawData = Buffer.alloc(rowBytes * height)

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes
    rawData[rowOffset] = 0 // filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height)
      const pxOffset = rowOffset + 1 + x * 4
      rawData[pxOffset] = r
      rawData[pxOffset + 1] = g
      rawData[pxOffset + 2] = b
      rawData[pxOffset + 3] = a
    }
  }

  const deflated = zlib.deflateSync(rawData)

  // Chunk helpers
  function crc32(buf) {
    let crc = 0xffffffff
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i]
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
      }
    }
    return (crc ^ 0xffffffff) >>> 0
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length, 0)
    const typeBuf = Buffer.from(type, 'ascii')
    const toCrc = Buffer.concat([typeBuf, data])
    const crcBuf = Buffer.alloc(4)
    crcBuf.writeUInt32BE(crc32(toCrc), 0)
    return Buffer.concat([len, typeBuf, data, crcBuf])
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr)
  const idatChunk = makeChunk('IDAT', deflated)
  const iendChunk = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

// Draw icon: Forest green (#426B55) background with clean white route shape
function iconPixel(x, y, w, h) {
  // rounded rectangle radius: 20%
  const r = Math.round(w * 0.2)
  const isInsideBg = (
    (x >= r && x <= w - r) ||
    (y >= r && y <= h - r) ||
    Math.hypot(x - r, y - r) <= r ||
    Math.hypot(x - (w - r), y - r) <= r ||
    Math.hypot(x - r, y - (h - r)) <= r ||
    Math.hypot(x - (w - r), y - (h - r)) <= r
  )

  if (!isInsideBg) {
    return [0, 0, 0, 0]
  }

  // Check if inside inner route shape:
  // Points (norm): Start circle (0.3, 0.7), End circle (0.7, 0.3)
  const nx = x / w
  const ny = y / h

  // Start circle
  if (Math.hypot(nx - 0.3, ny - 0.7) <= 0.09) {
    return [250, 250, 248, 255]
  }

  // End circle
  if (Math.hypot(nx - 0.7, ny - 0.3) <= 0.09) {
    return [250, 250, 248, 255]
  }

  // Connecting S-curve band
  const targetY = 0.5 + 0.2 * Math.sin((nx - 0.5) * Math.PI)
  const distToCurve = Math.abs(ny - targetY)
  if (nx >= 0.3 && nx <= 0.7 && distToCurve <= 0.045) {
    return [250, 250, 248, 255]
  }

  // Default Forest green (#426B55)
  return [66, 107, 85, 255]
}

// Draw mock screenshot of Today screen (narrow mobile 390x844)
function screenshotPixel(x, y, w, h) {
  const ny = y / h
  // Header area
  if (ny < 0.12) {
    return [250, 250, 248, 255]
  }
  // Bottom nav
  if (ny > 0.92) {
    return [255, 255, 255, 255]
  }
  // Focus card
  if (ny >= 0.14 && ny <= 0.24 && x >= 20 && x <= w - 20) {
    return [255, 255, 255, 255]
  }
  // Tasks card
  if (ny >= 0.26 && ny <= 0.52 && x >= 20 && x <= w - 20) {
    return [255, 255, 255, 255]
  }
  // Study time card
  if (ny >= 0.54 && ny <= 0.72 && x >= 20 && x <= w - 20) {
    return [255, 255, 255, 255]
  }
  // Milestone card
  if (ny >= 0.74 && ny <= 0.88 && x >= 20 && x <= w - 20) {
    return [255, 255, 255, 255]
  }
  // Background
  return [245, 245, 243, 255]
}

const pubDir = path.resolve('public')
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true })

const p192 = createPng(192, 192, iconPixel)
fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), p192)
console.log('Generated pwa-192x192.png')

const p512 = createPng(512, 512, iconPixel)
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), p512)
console.log('Generated pwa-512x512.png')

const pMaskable = createPng(512, 512, (x, y, w, h) => [66, 107, 85, 255])
fs.writeFileSync(path.join(pubDir, 'pwa-maskable-512x512.png'), pMaskable)
console.log('Generated pwa-maskable-512x512.png')

const screenshot = createPng(390, 844, screenshotPixel)
fs.writeFileSync(path.join(pubDir, 'screenshot-mobile.png'), screenshot)
console.log('Generated screenshot-mobile.png')
