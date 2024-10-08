import express from 'express';
import bodyParser from 'body-parser';
import { bot } from './services/bot.js';
import { Config } from './config.js';
import { startSupabaseSubscriptions } from './controller/EventsSubscriptionsController.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming requests as JSON
app.use(bodyParser.json());

// Setup the webhook endpoint
app.post('/telegram-webhook', (req, res) => {
    bot.handleUpdate(req.body); // Pass the incoming update to Telegraf
    res.sendStatus(200); // Respond to Telegram
});

// Set the webhook when the server starts
bot.telegram.setWebhook(`${Config.TELE_BOT_WEBHOOK_URL}/telegram-webhook`)
    .then(() => {
        console.log(`Webhook set at ${Config.TELE_BOT_WEBHOOK_URL}/telegram-webhook`);
    })
    .catch((error) => {
        console.error("Error setting webhook:", error);
    });

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    startSupabaseSubscriptions();
});
