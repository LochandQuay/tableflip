'use strict';

const Express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const slashCommandParser = require('./slashCommand');

const app = new Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const {SLACK_TOKEN: slackToken, PORT} = process.env;

if (!slackToken) {
  console.error('missing environment variable SLACK_TOKEN, friend');
  process.exit(1);
}

const port = PORT || 8080;

app.get('/slack', (req, res) => {

});

const slashCommand = slashCommandParser(slackToken);

app.get('/', (req, res) => {
  if (!req.query.code) { // access denied
    res.redirect('https://1f4dcd51.ngrok.io/');
    return;
  }
  const data = {form: {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: req.query.code
  }};

  request.post('https://slack.com/api/oauth.access', data, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let token = JSON.parse(body).access_token; // Auth Token
      request.post('https://slack.com/api/team.info', {form: {token: token}}, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let team = JSON.parse(body).team.domain;
          res.redirect('http://' + team + '.slack.com');
        }
      });
    }
  });
});

app.post('/', (req, res) => {
  console.log('REQUEST MADE: \n', req.body);
  slashCommand(req.body)
    .then((result) => {
      console.log('\n\nRESPONSE CREATED: \n\n', result);
      return res.json(result);
    })
    .catch(console.error);
});

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`, app.settings.env);
});
