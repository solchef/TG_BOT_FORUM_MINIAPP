// Load environment variables from a .env file if not already loaded
import dotenv from 'dotenv';

dotenv.config(); // Ensure this is called to load variables

const requiredEnvVars = [
    'TELE_BOT_TOKEN',
    'TELE_BOT_WEBHOOK_URL',
    'TELE_BOT_WEB_LINK'
];

// Check if all required environment variables are set
requiredEnvVars.forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
});

export const Config = {
    TELE_BOT_TOKEN: process.env.TELE_BOT_TOKEN,
    TELE_BOT_WEBHOOK_URL: process.env.TELE_BOT_WEBHOOK_URL, // Replace with your actual domain
    TELE_BOT_WEB_LINK: process.env.TELE_BOT_WEB_LINK // URL for the mini app
};
