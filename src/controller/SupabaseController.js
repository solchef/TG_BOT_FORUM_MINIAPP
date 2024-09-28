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
            imageurl: getRandomImageUrl(),
            email: `${username}@broscams.io`,
            firstName: firstName,
            lastName: lastName
        };

        const response = await apiPost('profile', data);

        const profileId = response[0].id;
        console.log(profileId)

        await addUserToMemberTable(profileId);

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

// Fetch all servers (reusable function)
export async function getAllServers() {
    return await apiCall('server'); // Reuse apiCall to fetch servers
}

// Add user to the member table for each server
export async function addUserToMemberTable(profileId) {
    try {
        const servers = await getAllServers();

        if (servers.length === 0) {
            console.log('No servers found');
            return;
        }

        // Add the user to the member table for each server
        const responses = await Promise.all(servers.map(async (server) => {
            const memberData = {
                profileid: profileId, // Reference to the user profile id
                serverid: server.id,  // Reference to the server id
                role: 'GUEST',        // Default role is 'GUEST'
            };

            return await apiPost('member', memberData); // Reuse apiPost to insert into the member table
        }));

        return responses;
    } catch (error) {
        console.error('Error adding user to member table:', error);
        return { error: error.message };
    }
}

// Function to register a user and add them to the member table for all servers
// export async function registerAndAddUser(telegramId, username, firstName, lastName) {
//     // Register the user first
//     const registeredUser = await registerUserWithTelegram(telegramId, username, firstName, lastName);

//     if (registeredUser.error) {
//         console.error('User registration failed:', registeredUser.error);
//         return;
//     }

//     const profileId = registeredUser[0].id; // Assuming the profile is returned with an ID

//     // Add the user to the member table for all servers
//     const addedMembers = await addUserToMemberTable(profileId);

//     return addedMembers;
// }


