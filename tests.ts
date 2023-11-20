const axios = require('axios');
const Bet = require('./posts').Bet;


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
axios.post(baseUrl + betEndpoint + 'new', myEvent)
  .then(response => {
    console.log('POST request successful:', response.data);
  })
  .catch(error => {
    console.error('Error making POST request:', error.message);
  });

