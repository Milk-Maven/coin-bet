// @ts-ignore
const axios = require('axios');

//@ts-ignore
const posts = require('./posts')

//@ts-ignore
type Bet = {
  greeting: string;
  event_description: string;
  outcomes: string[];
  explainer: string;
};


// Define the EventDetails type

// Example event object
const myEvent: any = {
  greeting: "Hey there, high rollers! 🐮✨ Ready to milk the odds and grab some wins today?",
  event_description: "NFL Sunday Showdown",
  outcomes: ["Team A Victory", "Over 50 Total Points", "Player X MVP", "No Overtime"],
  explainer: ""
};

// URL for your API endpoint
const baseUrl = 'http://localhost:3000/';
const betEndpoint = 'bet/';

// Make an HTTP POST request
axios.post(baseUrl + betEndpoint + 'new', posts.spookyPosts[0])
  .then((response: { data: string }) => {
    console.log('POST request successful:', response.data);
  })
  .catch((error: { message: string }) => {
    console.error('Error making POST request:', error.message);
  });

