# urlShortener


Application built with Node.js, Vue.js and MongoDB to act as a URL shortner. 


I built this to get a better application of how to build a backend API with Js, using Express, and how to interface with it using an HTML frontend. 

The API performs 2 main functions. 
1. Being able to create a shortened URL using an alias and the original URL. This operates by adding the URL and the alias to a MongoDB database, and creates a random sequence to be an alias if one is not provided

2. Being able to redirect url requests to shortened URLs to actual URls by performing a database lookup and redirecting appropriating. 


How it was Made:

- Languages Used : JavaScript, HTML, CSS
- Technologies Used:
    - Node.js
    - Express
    - Vue.js
    - MongoDB


This application is not currently live.
To run:
	- npm run dev
