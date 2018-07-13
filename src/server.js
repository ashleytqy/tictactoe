const express = require("express");
const bodyParser = require("body-parser");

const commandParser = require("./commandParser");
const SlackHelper = require("./SlackHelper");

// eagerly load all users
let slackHelper = new SlackHelper();
slackHelper.loadUsers();

const PORT = 3000;
const SLACK_TOKEN = "5a7020854433d045d34d0e8c945f8881";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

if (!SLACK_TOKEN) {
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
      return res.json(slackMsg(result));
    })
    .catch(console.error);
});

app.listen(PORT, () => {
  console.log(`Server started at localhost:${PORT}`);
});

function slackMsg(messageObject) {
  if (!messageObject.valid) {
    return {
      fallback: messageObject.error_msg,
      response_type: "in_channel",
      attachments: [
        {
          color: "danger",
          text: messageObject.error_msg
        }
      ]
    };
  } else {
    return {
      text: messageObject.success_msg,
      response_type: "in_channel"
    };
  }
}
