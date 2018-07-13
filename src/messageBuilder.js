function buildErrorMsg(message) {
  return { valid: false, error_msg: `Oops – ${message}` };
}

function buildSuccessMsg(message) {
  return { valid: true, success_msg: message };
}

module.exports = {
  buildSuccessMsg: buildSuccessMsg,
  buildErrorMsg: buildErrorMsg
};
