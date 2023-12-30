
const express = require('express')
const hardhat = require('hardhat')

const app = express()

app.get('/', async (_, res) => {
  try {
    // will recompile if there are changes
    await hardhat.run('compile')

    // Grab SVG content from renderer

    const ThreeBallsGridMock = await hardhat.ethers.getContractFactory('ThreeBallsGridMock', {})
    const ThreeBallsGridURI = await hardhat.ethers.getContractFactory('ThreeBallsGridURI', {})

    const tbgMock = await ThreeBallsGridMock.deploy()
    await tbgMock.deployed()


    const gridURI = await ThreeBallsGridURI.attach(
      await tbgMock.tokenURIContract()
    )

    console.log('Mock',tbgMock.address)
    console.log('URI',gridURI.address)

    const tokenURI = await tbgMock.tokenURI(0)



    const tokenURIStr = tokenURI.replace('data:application/json;utf8,', '')
    console.log('>>>>>', tokenURIStr)
    const encodedSVG = JSON.parse(tokenURIStr).image.replace('data:image/svg+xml;base64,', '')
    const decodedSVG = Buffer.from(encodedSVG, 'base64').toString('utf8')

    // Will refresh every 1 second
    res.send(`
      <html>
      <head>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {

          }

          svg {
            margin: 1vw;
            box-shadow: 4px 4px 10px
          }
        </style>
      </head>
      <body>
      ${decodedSVG}
      </body>
      <style>body{margin:0;padding:0;}</style>
      <script>console.log(JSON.parse('${tokenURIStr}'))</script>
      </html>
    `)
  } catch (e) {
    // in case you grab compiler errors
    res.send(`
      <html>
        <head>

        </head>
          ${e}
      </html>
  `)
  }
})

const PORT = process.env.PORT || 5005
app.listen(PORT, () => {
  console.log(`Serving SVG on port ${PORT}`)
})