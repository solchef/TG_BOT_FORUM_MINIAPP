import { bot, mainMenuKeyboard } from "../services/bot.js";
import { supabase } from "../services/supabase.js";
import { getAllTelegramIds } from "./SupabaseController.js";

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
                let telegramIds = users.map(user => user.userid);

                for (const telegramId of telegramIds) {
                    try {

                        let message = await bot.telegram.sendMessage(telegramId, `New Forum Message/Content: \n\n ${newContent}`, {
                            reply_markup: mainMenuKeyboard,
                            parse_mode: "Markdown",
                        });

                        // Insert or update message tracking in Supabase
                        // const { error: updateError } = await supabase
                        //     .from('telegramusermessages')
                        //     .upsert({
                        //         tid: telegramId,
                        //         // messageids: [message.id],
                        //         lastmessageid: lastMenuMessageId,
                        //     }, { onConflict: ['tid'] }); // Upsert based on `tid`

                        // if (updateError) {
                        //     console.error('Error inserting/updating user message record:', updateError.message);
                        // }

                    } catch (error) {
                        console.error(`Error sending/editing message to Telegram ID ${telegramId}:`, error);
                    }
                }
            }
        )
        .subscribe();
        
    console.log('Supabase real-time subscriptions started.');
};
