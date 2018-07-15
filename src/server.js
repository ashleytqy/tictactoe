const express = require("express");
const bodyParser = require("body-parser");

const commandParser = require("./commandParser");
const SlackHelper = require("./slackHelper");
const { slackMsg } = require("./messageBuilder");

// eagerly load all users
let slackHelper = new SlackHelper();
slackHelper.loadUsers();

const PORT = 3000;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

if (!SLACK_CLIENT_SECRET) {
  console.error("missing environment variables SLACK_TOKEN.");
  process.exit(1);
}

/*
Handles a POST request
and returns a JSON response
*/
app.post("/", (req, res) => {
  commandParser(req.body)
    .then(result => {
      res.set('content-type', 'application/json')
      return res.json(slackMsg(result));
    })
    .catch(console.error);
});

app.get("/", (req, res) => {
  return res.json("Debugging!");
})

app.listen(PORT, () => {
  console.log(`Server started at localhost:${PORT}`);
});
