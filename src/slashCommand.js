const slashCommandParser =
  (slackToken) => body => new Promise((resolve, reject) => {
    if (!body) {

    }

    if (slackToken !== body.token) {

    }

    console.log(body);

    switch(body.command) {
      case '/tableflip':
        return resolve({
          as_user: true,
          text: '(╯°□°）╯︵ ┻━┻',
          mrkdwn: false
        });
      case '/pleaserespecttables':
        return resolve({
          response_type: 'in_channel',
          as_user: true,
          text: '┬─┬ノ(@_@ノ)',
          mrkdwn: false
        });
      case '/doubletableflip':
        return resolve({
          as_user: true,
          text: '┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻',
          mrkdwn: false
        })
      default:
        return;
    }
  });

module.exports = slashCommandParser;
