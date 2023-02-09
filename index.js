const http = require('http')
const querystring = require('querystring')

const { loadImage, createCanvas } = require('canvas')
const width = 1280
const height = 720
const avatarX = 40
const avatarY = 80
const avatarWidth = 100
const avatarHeight = 100
const radius = 10
const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

context.fillStyle = '#131313'
context.fillRect(0, 0, width, height)
context.font = 'bold 72pt Menlo'
context.textBaseline = 'top'
context.textAlign = 'center'
context.fillStyle = '#f7ab07'

const imgText = 'Dare or Not?'
const textAlign = context.measureText(imgText).width

context.fillRect(590 - textAlign / 2 - 10, 170 - 5, textAlign + 20, 120)
context.fillStyle = '#ffffff'
context.fillText(imgText, 555, 120)
context.fillStyle = '#eaeaea'
context.font = 'bold 16pt Menlo'
context.fillText('dare.plus', 755, 600)


var Point = function(x, y) {
  return {x:x, y:y}
}

function drawRoundedRect(img, r, ctx) {
  ctx.save()
  var ptA = Point(img.x + r, img.y)
  var ptB = Point(img.x + img.width, img.y)
  var ptC = Point(img.x + img.width, img.y + img.height)
  var ptD = Point(img.x, img.y + img.height)
  var ptE = Point(img.x, img.y)

  ctx.beginPath()

  ctx.moveTo(ptA.x, ptA.y)
  ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r)
  ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r)
  ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r)
  ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r)
  ctx.clip()
}

http.createServer(function (req, res) {
  const thisUrl = new URL(req.url, 'http://' + req.headers.host)
  const query = new URLSearchParams(thisUrl.search).toString()
  res.writeHead(200, {'Content-Type': 'image/png'})

  const avatar = querystring.parse(query)['avatar'] || 'https://fakeimg.pl/100x100/?retina=1&text=avatar'

  loadImage(avatar).then((data) => {
    drawRoundedRect({
      x: avatarX,
      y: avatarY,
      width: avatarWidth,
      height: avatarWidth
    }, radius, context)
    context.drawImage(data, avatarX, avatarY, avatarWidth, avatarWidth)
    const imgBuffer = canvas.toBuffer('image/png')
    res.write(imgBuffer)
    res.end()
  }).catch(err => {
    console.log('oh no!', err)
  })

}).listen(8888)