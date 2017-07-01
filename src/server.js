const Express = require('express');
const bodyParser = require('body-parser');
const slashCommandParser = require('./slashCommand');

const app = new Express();
app.use(bodyParser.urlencoded({extended: true}));

const {SLACK_TOKEN: slackToken, PORT} = process.env;

if (!slackToken) {
  console.error('missing environment variable SLACK_TOKEN, friend');
  process.exit(1);
}

const port = PORT || 80;

const slashCommand = slashCommandParser(slackToken);

app.post('/', (req, res) => {
  slashCommand(req.body)
    .then((result) => {
      return res.json(result);
    })
    .catch(console.error);
});

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
