/*
This function formats a message into an object
with a valid attribute, and an error_msg attribute
with the message passed in the params
*/
function buildErrorMsg(message) {
  return { valid: false, error_msg: `Oops – ${message}` };
}

/*
This function formats a message into an object
with a valid attribute, and an success_msg attribute
with the message passed in the params
*/
function buildSuccessMsg(message) {
  return { valid: true, success_msg: message };
}

/*
This function formats a message object into a Slack message.
If the message is an error, it displays it as an attachment with
a red line on the side. If not, it displays it as plain text.
*/
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


module.exports = {
  buildSuccessMsg: buildSuccessMsg,
  buildErrorMsg: buildErrorMsg,
  slackMsg: slackMsg
};
