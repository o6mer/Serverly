# Severly

https://serverly.netlify.app

<img src="https://p475.p0.n0.cdn.getcloudapp.com/items/E0unjw1l/Screen%20Shot%202020-08-23%20at%2020.43.25.png?source=viewer&v=9c3a5b44d30a1744f9e7385d61b4b863" height="400" />

## Table of Contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Main Features](#main-features)
* [Setup](#setup)
* [Contributing](#contributing)

## General Info
Severly is a web application that allows users to manage servers.

## Technologies
* React.js
* Node.js
* PostgreSQL
* Express

## Main Features
The Severly app has several key features to allow users to manage servers effectively. 
The app includes a server list view, where all servers are displayed in a table format on the main page.
Users can create new servers by specifying their IP address, name, and server type from a dropdown menu.
Once created, users can start and stop servers with the click of a button, and servers can be deleted from the list when no longer needed.
The app also calculates the real-time price of running servers, based on the server's price per minute and the amount of time it has been running.
Finally, users can change the currency used to calculate server prices. 

## Setup

To run the application locally:
1. Clone the repository.
2. Ask for the `.env` files and put them in the root of `frontend` and `backend`. 
3. run `cd ./frontend && npm i && npm run dev`.
4. run `cd ./backend && npm i && npm run dev`.
5. Open `http://localhost:5173` in the browser.



## Contributing
If you'd like to contribute to Severly, please fork the repository and create a pull request. We welcome contributions of all types, including bug fixes, new features, and documentation improvements.
