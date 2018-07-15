let slack = require("slack");

const SLACK_WEB_TOKEN = process.env.SLACK_WEB_TOKEN;

// a map of a user's name to their userID

let users = {};

/*
Describes a helper class that talks to the Slack API
*/
class SlackHelper {
  getUserId(username) {
    // load users again in case someone joins midway
    this.loadUsers();
    return users[username];
  }

  loadUsers() {
    slack.users.list(
      {
        token: SLACK_WEB_TOKEN
      },
      function(err, data) {
        if (err) {
          console.log(err);
          return;
        }

        const members = data.members;
        let member;

        // place members in users
        for (var i = 0; i < members.length; i++) {
          member = members[i];
          users[member.name] = member.id;
        }
      }
    );
  }
}

module.exports = SlackHelper;
