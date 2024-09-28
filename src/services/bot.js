import { Telegraf } from 'telegraf';
import { Config } from '../config.js';

const bot = new Telegraf(Config.TELE_BOT_TOKEN);

// const provider = new WalletConnectProvider({
//     infuraId: "YOUR_INFURA_ID", // Required
// });

// bot.command('connect', async (ctx) => {
//     // Enable session (triggers QR Code modal)
//     await provider.enable();

//     // Get the account address
//     const accounts = await provider.request({ method: "eth_accounts" });
//     const account = accounts[0];

//     ctx.reply(`Connected to wallet: ${account}`);
// });

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
        return [];
    } else if (endpoint === 'recent') {
        return [];
    }
    return [];
}

// Function to display the main menu (edit message)
async function showMainMenu(ctx) {
    const webLink = Config.TELE_BOT_WEB_LINK;

    try {
        // Use editMessageMedia to update the photo and caption
        await ctx.editMessageMedia(
            {
                type: 'photo',
                media: { url: 'https://www.broscams.io/header.png' }, // Header image URL
                caption: "Select an option from the menu below:",
                parse_mode: "Markdown",
            },
            {
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
    } catch (error) {
        // If editing the message fails (e.g., message no longer exists), send a new one
        await ctx.replyWithPhoto(
            { url: 'https://www.broscams.io/header.png' },
            {
                caption: "*BROSCAMS FORUM*\nSelect an option from the menu below:",
                parse_mode: "Markdown",
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
}

// Group-specific menu with "About" and "Go to Forum"
async function sendGroupMenu(ctx) {
    const webLink = "https://t.me/BroScamsBot"; // Web link for the forum

    await ctx.replyWithPhoto(
        { url: 'https://www.broscams.io/header.png' }, // Header image URL
        {
            caption: "*Welcome to the Group!*\n",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "GO TO FORUM",
                            url: webLink, // Add the link for "GO TO FORUM"
                        },
                    ],
                ],
            },
        }
    );
}


// Trigger when the bot is added to a group
bot.on('new_chat_members', async (ctx) => {
    const newMembers = ctx.message.new_chat_members;
    const isBotAdded = newMembers.some((member) => member.id === ctx.botInfo.id);

    if (isBotAdded) {
        // Send the group-specific menu with inline buttons
        await sendGroupMenu(ctx);
    }
});

bot.command('start_group_welcome', (ctx) => {
    sendGroupMenu(ctx);
});

// Command to display the main menu for individual users
// bot.command('menu', showMainMenu);
bot.command('start', (ctx) => {
    showMainMenu(ctx);  // Call the function that displays the main menu
});

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
            await ctx.editMessageMedia(
                {
                    type: 'photo',
                    media: headerImage,
                    caption: "*ABOUT BROSCAMS*\n\nWe are a dedicated community of crypto degens, running through a forum powered by $BROS.BroScams is a community, dedicated to making money on  the Internet:Through various earning schemes,IT, malware, cracking, security, programming and many more tools.",
                    parse_mode: "Markdown",
                },
                {
                    reply_markup: mainMenuKeyboard,
                }
            );
            break;

        case 'subscriptions':
            await ctx.editMessageMedia(
                {
                    type: 'photo',
                    media: headerImage,
                    caption: "*SUBSCRIPTIONS*\n\nYou have no $BROS membership subscription.",
                    parse_mode: "Markdown",
                },
                {
                    reply_markup: mainMenuKeyboard,
                }
            );
            break;

        case 'channels':
            const channels = await mockApiCall('channels');
            await ctx.editMessageMedia(
                {
                    type: 'photo',
                    media: headerImage,
                    caption: `*CHANNELS*\n\nAvailable channels:\n\n${channels.map((ch) => `• ${ch}`).join('\n')}`,
                    parse_mode: "Markdown",
                },
                {
                    reply_markup: mainMenuKeyboard,
                }
            );
            break;

        case 'recent':
            const recentThreads = await mockApiCall('recent');
            await ctx.editMessageMedia(
                {
                    type: 'photo',
                    media: headerImage,
                    caption: `*RECENT THREADS*\n\nHere are the most recent threads:\n\n${recentThreads.map((thread) => `• ${thread}`).join('\n')}`,
                    parse_mode: "Markdown",
                },
                {
                    reply_markup: mainMenuKeyboard,
                }
            );
            break;

        default:
            await ctx.editMessageMedia(
                {
                    type: 'photo',
                    media: headerImage,
                    caption: "Unknown command. Please try again.",
                    parse_mode: "Markdown",
                },
                {
                    reply_markup: mainMenuKeyboard,
                }
            );
    }
});



// Export the bot instance for use in the main file
export { bot };
