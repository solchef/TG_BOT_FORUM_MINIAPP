import { Telegraf } from 'telegraf';
import { Config } from '../config.js';
import { getChannels, getRecentMessages, isUserRegistered, registerUserWithTelegram } from '../controller/SupabaseController.js';

const bot = new Telegraf(Config.TELE_BOT_TOKEN);

// Middleware to auto-register the user if not already registered
bot.use(async (ctx, next) => {
    // console.log(ctx.from)    
    const { id: telegramId, username, first_name: firstName, last_name:lastName} = ctx.from;

    // Check if the user is already registered
    const isRegistered = await isUserRegistered(telegramId);

    // If not registered, register the user
    if (!isRegistered) {
        const result = await registerUserWithTelegram(telegramId, username, firstName, lastName);
        if (result.error) {
            // ctx.reply('There is an temporary technical hitch on our servers. This will be resolve shortly. (+-:');
            console.log(result.error)
        } else {
            //ctx.reply('You have been registered successfully!');
        }
    }

    // Proceed to the next middleware or command
    return next();
});

// Function to generate the inline keyboard with a "Back to Menu" option
const mainMenuKeyboard = {
    inline_keyboard: [
        [
            { text: "BACK TO MENU", callback_data: "menu" },
        ],
    ],
};

// Function to display the main menu (edit message)
async function showMainMenu(ctx) {
    const webLink = Config.TELE_BOT_WEB_LINK;

    try {
        // Use editMessageMedia to update the photo and caption
        await ctx.editMessageMedia(
            {
                type: 'photo',
                media: { url: 'https://wepqmlljzvxjrytnhlhi.supabase.co/storage/v1/object/public/broscams/header.png' }, // Header image URL
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
            { url: 'https://wepqmlljzvxjrytnhlhi.supabase.co/storage/v1/object/public/broscams/header.png' },
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
// Function to send the group menu to new members with additional inline buttons
async function sendGroupMenu(member, ctx) {
    const forumLink = "https://t.me/BroScamsBot"; // Web link for the forum
    const uniswapLink = "https://broscams.io"; // Link to Uniswap
    const twitterLink = "https://twitter.com/broscams"; // Link to $BROS Twitter page
    let newMember = member.username || member.first_name;

    await ctx.replyWithPhoto(
        { url: 'https://wepqmlljzvxjrytnhlhi.supabase.co/storage/v1/object/public/broscams/header-group.png' }, // Header image URL
        {
            caption: `*Welcome to the Group, ${newMember}!*\n`,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "$BROS",
                            url: "https://broscams.io", // Link to Uniswap
                        },
                        {
                            text: "$BROS TWITTER",
                            url: twitterLink, // Link to $BROS Twitter
                        }
                    ],
                    [
                        {
                            text: "GO TO FORUM",
                            url: forumLink, // Add the link for "GO TO FORUM"
                        },
                    ],
                ],
            },
        }
    );
}

bot.on('new_chat_members', async (ctx) => {
    const newMembers = ctx.message.new_chat_members;

    for (const member of newMembers) {
        // Call the sendGroupMenu function to send the custom welcome message
        await sendGroupMenu(member,ctx);
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
    const headerImage = { url: 'https://wepqmlljzvxjrytnhlhi.supabase.co/storage/v1/object/public/broscams/header.png' }; // Replace with your header image URL

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
            const channels = await getChannels();
            // console.log(channels)
            // if (channels.length === 0) {
            //     ctx.reply('No channels found.');
            // } else {
            //     ctx.reply(`Channels: ${channels.map(c => c.name).join(', ')}`);
            // }
            await ctx.editMessageMedia(
                {
                    type: 'photo',
                    media: headerImage,
                    caption: `*CHANNELS*\n\nAvailable channels:\n\n${channels.map((ch) => `• ${ch.name}`).join('\n')}`,
                    parse_mode: "Markdown",
                },
                {
                    reply_markup: mainMenuKeyboard,
                }
            );
            break;

        case 'recent':
            const recentMessages = await getRecentMessages();
            // console.log(recentMessages)

            await ctx.editMessageMedia(
                {
                    type: 'photo',
                    media: headerImage,
                    caption: `*RECENT THREADS*\n\nHere are the most recent messages/discussions:\n\n${recentMessages.map((thread) => `• ${thread.content}`).join('\n')}`,
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
