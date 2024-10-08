import { bot } from "../services/bot.js";
import { supabase } from "../services/supabase.js";
import { getAllTelegramIds } from "./SupabaseController.js";

// Variable to hold the last sent menu message ID
let lastMenuMessageId = null;

// Function to generate the inline keyboard with a "Go to Menu" option
const inlineKeyboardMenu = {
    inline_keyboard: [
        [
            { text: "GO TO MENU", callback_data: "menu" },
        ],
    ],
};

export const startSupabaseSubscriptions = async () => {
    supabase
        .channel('schema-db-changes')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
            },
            async (payload) => {
                const newContent = payload.new.content;

                let users = await getAllTelegramIds();
                // Keep the filter for testing with your own ID
                let telegramIds = users.map(user => user.userid).filter(id => id === '6686793326');
                console.log(telegramIds);

                telegramIds.forEach(async (telegramId) => {
                    try {
                        // If lastMenuMessageId is not null, edit that message
                        if (lastMenuMessageId) {
                            await bot.telegram.editMessageText(telegramId, lastMenuMessageId, undefined, `New content: ${newContent}`, {
                                reply_markup: inlineKeyboardMenu,
                                parse_mode: "Markdown",
                            });
                        } else {
                            // If lastMenuMessageId is null, send a new message and save its ID
                            const sentMessage = await bot.telegram.sendMessage(telegramId, `New content: ${newContent}`, {
                                reply_markup: inlineKeyboardMenu,
                                parse_mode: "Markdown",
                            });
                            lastMenuMessageId = sentMessage.message_id; // Save the message ID for future edits
                        }
                    } catch (error) {
                        console.error(`Error sending/editing message to Telegram ID ${telegramId}:`, error);
                    }
                });
            }
        )
        .subscribe();

    console.log('Supabase real-time subscriptions started.');
};
