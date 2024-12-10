import dotenv from 'dotenv'; // Import dotenv
dotenv.config(); // Load environment variables from .env file

import fetch from 'node-fetch'; // Import fetch

const API_KEY = process.env.TWELVE_DATA_API_KEY;

console.log(`Your API key is: ${API_KEY}`);

// Example of using the API key for a fetch request
const pair = 'EUR/USD';
const url = `https://api.twelvedata.com/time_series?symbol=${pair}&interval=5min&apikey=${API_KEY}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            console.log('Data fetched successfully:', data);
        } else {
            console.log('Error fetching data:', data);
        }
    })
    .catch(err => console.error('Fetch error:', err));
