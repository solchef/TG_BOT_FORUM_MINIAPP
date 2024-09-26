import { Telegraf } from 'telegraf';
import { Config } from '../config.js';

const bot = new Telegraf(Config.TELE_BOT_TOKEN);

// Function to generate the inline keyboard with a "Back to Menu" option
const mainMenuKeyboard = {
    inline_keyboard: [
        [
            { text: "BACK TO MENU", callback_data: "menu" },
        ],
    ],
};

// Mock function to simulate an API call
async function mockApiCall(endpoint) {
    if (endpoint === 'channels') {
        return ['Channel 1', 'Channel 2', 'Channel 3'];
    } else if (endpoint === 'recent') {
        return ['Thread 1: Discussion A', 'Thread 2: Discussion B', 'Thread 3: Discussion C'];
    }
    return [];
}

// Start command
bot.start(async (ctx) => {
    await ctx.reply("Welcome! Use the /menu command to see the options.");
});

// Function to display the main menu
async function showMainMenu(ctx) {
    const webLink = Config.TELE_BOT_WEB_LINK;

    await ctx.replyWithPhoto(
        { url: 'https://www.broscams.io/header.png' }, // Header image URL
        {
            caption: "*BROSCAMS FORUM*\nSelect an option from the menu below:",
            parse_mode: "Markdown", // Formatting replies with Markdown
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "ABOUT FORUM", callback_data: "about" },
                        { text: "SUBSCRIPTIONS", callback_data: "subscriptions" },
                    ],
                    [
                        { text: "CHANNELS", callback_data: "channels" },
                        { text: "RECENT THREADS", callback_data: "recent" },
                    ],
                    [
                        {
                            text: "OPEN FORUM",
                            web_app: {
                                url: webLink,
                            },
                        },
                    ],
                ],
            },
        }
    );
}

// Command to display the main menu
bot.command('menu', showMainMenu);

// Callback query handler for inline keyboard buttons
bot.on('callback_query', async (ctx) => {
    const callbackData = ctx.callbackQuery?.data;

    // Include the header image in all replies
    const headerImage = { url: 'https://www.broscams.io/header.png' }; // Replace with your header image URL

    switch (callbackData) {
        case 'menu':
            // Show the main menu when "BACK TO MENU" is clicked
            return showMainMenu(ctx);

        case 'about':
            await ctx.replyWithPhoto(
                headerImage,
                {
                    caption: "*ABOUT FORUM*\n\nThis forum is dedicated to discussions about BROSCAMS.",
                    parse_mode: "Markdown",
                    reply_markup: mainMenuKeyboard, // Include "Back to Menu" button
                }
            );
            break;

        case 'subscriptions':
            await ctx.replyWithPhoto(
                headerImage,
                {
                    caption: "*SUBSCRIPTIONS*\n\nHere you can manage your forum subscriptions.",
                    parse_mode: "Markdown",
                    reply_markup: mainMenuKeyboard, // Include "Back to Menu" button
                }
            );
            break;

        case 'channels':
            const channels = await mockApiCall('channels');
            await ctx.replyWithPhoto(
                headerImage,
                {
                    caption: `*CHANNELS*\n\nAvailable channels:\n\n${channels.map((ch) => `• ${ch}`).join('\n')}`,
                    parse_mode: "Markdown",
                    reply_markup: mainMenuKeyboard, // Include "Back to Menu" button
                }
            );
            break;

        case 'recent':
            const recentThreads = await mockApiCall('recent');
            await ctx.replyWithPhoto(
                headerImage,
                {
                    caption: `*RECENT THREADS*\n\nHere are the most recent threads:\n\n${recentThreads.map((thread) => `• ${thread}`).join('\n')}`,
                    parse_mode: "Markdown",
                    reply_markup: mainMenuKeyboard, // Include "Back to Menu" button
                }
            );
            break;

        default:
            await ctx.replyWithPhoto(
                headerImage,
                {
                    caption: "Unknown command. Please try again.",
                    reply_markup: mainMenuKeyboard, // Include "Back to Menu" button
                }
            );
    }
});

// Export the bot instance for use in the main file
export { bot };
