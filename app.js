require('dotenv').config();
const { App } = require('@slack/bolt');
const openai = require('openai');

const USER_TOKEN = process.env.SLACK_USER_TOKEN;
const SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

openai.apiKey = process.env.OPENAI_API_KEY;

const app = new App({
  token: USER_TOKEN,
  signingSecret: SIGNING_SECRET
});

app.message(async ({ event, say }) => {
  if (event.text.includes('<@>') || event.channel_type === 'im') {
    try {
      const gpt3Response = await openai.Completion.create({
        engine: "davinci",
        prompt: event.text.replace('<@>', ''),
        max_tokens: 150
      });

      await say(gpt3Response.choices[0].text.trim());
    } catch (error) {
      console.error(error);
      await say("Sorry, I couldn't understand that.");
    }
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app with GPT-3 integration is running!');
})();