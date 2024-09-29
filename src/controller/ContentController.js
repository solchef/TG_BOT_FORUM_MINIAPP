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



const channels = {
    "Home": [
        "Announcements",
        "Introductions",
        "General Discussion",
        "Feedback and Suggestions"
    ],
    "Cracking": [
        "Cracking Tutorials",
        "Cracking Tools",
        "Account Cracking",
        "Software Cracking"
    ],
    "Hacking": [
        "Hacking Tutorials",
        "Hacking Tools",
        "Exploits",
        "Vulnerabilities"
    ],
    "Leaks": [
        "Database Leaks",
        "Account Leaks",
        "Software Leaks",
        "Other Leaks"
    ],
    "MarketPlace": [
        "Buy, Sell, Trade",
        "Service Offers",
        "Account Sales",
        "Software Sales"
    ],
    "Premium": [
        "VIP Access",
        "Exclusive Content",
        "Premium Tutorials",
        "Premium Tools"
    ],
    "Money": [
        "Money Making Methods",
        "Investment Strategies",
        "Financial Discussions"
    ],
    "Crypto": [
        "Cryptocurrency Trading",
        "Blockchain Technology",
        "Crypto News"
    ],
    "Memes": [
        "Funny Memes",
        "Meme Contests",
        "Meme Requests"
    ]
}

const servers = await apiCall('server');

for (const server in channels) {
    const channelServer = servers.find(srv => srv.name === server);
    const channelsToAdd = channels[server];

    for (const element of channelsToAdd) {
        const data = {
            name: element,
            type: 'TEXT',
            profileid: '5c5f65d2-1cb3-4e68-bfa1-5a99f01b650b',
            serverid: channelServer.id
        };
    
        await apiPost('channel', data); // This will work properly with async/await
    }
    
}
