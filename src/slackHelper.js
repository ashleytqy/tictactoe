let slack = require("slack");

let users = {};

class SlackHelper {
  constructor() {
    this.token =
      "xoxp-397047310467-397047310995-398070207733-53b434539fa3cd80035d3f4c64c49b6a";
  }

  getUserId(username) {
    // load users again in case someone joins midway
    this.loadUsers();
    return users[username];
  }

  loadUsers() {
    slack.users.list(
      {
        token: "xoxp-397047310467-397047310995-398070207733-53b434539fa3cd80035d3f4c64c49b6a"
      },
      function(err, data) {
        if (err) {
          console.err(err);
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
