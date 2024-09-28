import { supabaseApi } from "../services/supabase.js";

// Function to call the Supabase API
async function apiCall(endpoint, params = {}) {
    try {
        const response = await supabaseApi.get(`/rest/v1/${endpoint}`, {
            params: params, // Pass query parameters if any
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
}


// Function to POST data to the Supabase API
async function apiPost(endpoint, data) {
    try {
        const response = await supabaseApi.post(`/rest/v1/${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Prefer': 'return=representation', // ensures that the response returns the inserted data
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        return { error: error.message };
    }
}

// Generate a random Picsum URL for the image
function getRandomImageUrl() {
    // You can change the width/height as needed
    const width = 200;
    const height = 300;
    return `https://picsum.photos/${width}/${height}`;
}


// Fetch channels from the Supabase API
export async function getChannels() {
    return await apiCall('server'); // Adjust the endpoint name as needed
}

// Fetch recent messages from the Supabase API
export async function getRecentMessages() {
    return await apiCall('message'); // Adjust the endpoint name as needed
}

// Register new user with Telegram
export async function registerUserWithTelegram(telegramId, username, firstName, lastName) {
    try {
        const data = {
            userid: telegramId,
            name: username,
            imageurl:getRandomImageUrl(),
            email: `${username}@broscams.io`,
            firstName:firstName,
            lastName:lastName
        };

        const response = await apiPost('profile', data); // Adjust 'profile' to your Supabase table name

        if (response.error) {
            throw new Error(response.error);
        }
        return response;
    } catch (error) {
        console.error('Error registering user with Telegram:', error);
        return { error: error.message };
    }
}

// Function to check if a user is already registered
// Function to check if a user is already registered
export async function isUserRegistered(telegramId) {
    const queryParams = {
        userid: `eq.${telegramId}`, // Supabase REST API filter syntax
        select: '*', // to specify that we want all fields (can be adjusted if needed)
    };

    const data = await apiCall('profile', queryParams); // Reuse the apiCall function with parameters
    return data.length > 0; // returns true if the user exists
}

