const express = require('express')
const bodyParser = require('body-parser')

// const game = require('./game')
// const gameMaster = require('./gameMaster')
const commandParser = require('./commandParser')

const PORT = 3000
const SLACK_TOKEN = '5a7020854433d045d34d0e8c945f8881'

const app = express()
app.use(bodyParser.urlencoded({extended: true}))

if (!SLACK_TOKEN) {
  console.error('missing environment variables SLACK_TOKEN and/or REBRANDLY_APIKEY')
  process.exit(1)
}

// const slashCommand = slashCommandFactory(rebrandlyClient, slackToken)

// active games (can end, and it will be removed from set)
// channels with games => channel name

app.post('/', (req, res) => {
  commandParser(req.body)
    .then((result) => {
      return res.json(result)
    })
    .catch(console.error)
})

app.listen(PORT, () => {
  console.log(`Server started at localhost:${PORT}`)
})