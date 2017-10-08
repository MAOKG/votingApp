# Voting App Web Application

> This is a MERN stack application that allow users to vote and create their own voting polls [Demo](https://voting-app-react.herokuapp.com)

## User Stories

**As an unauthenticatied user**
- I can log in or sign up using local account or Google account
- I can see everyone's polls
- I can sort polls by popolarity or date
- I search polls by title and author
**As an authenticatied user**
- I can link and unlink local and Google account
- I can vote on everyone's polls
- I can create a poll with any number of possible options
- I can control whether voters can add new options to my poll
- I can delete polls that I decide I don't want anymore
- I can see the result of a poll in chart form after I voted

## Build With

**Server Side Rendering**: server-side prerender code so that when it gets down to the client, browser can instantly show the markup while app bootstraps in the background. It makes everything feel very instantaneous

### Front End
- [React](https://reactjs.org/) - The Javascript library used
- [Redux](http://redux.js.org/) - Predictable state container for JavaScript apps
- [Chart.js](http://www.chartjs.org/) - JavaScript charting
- [Semantic UI React](https://react.semantic-ui.com/) - UI component framework

### Back End
- [Express](https://expressjs.com/) - Web application framework
- [Node](https://nodejs.org/) - Execution environment for event-driven server-side and networking applications
- [Passport](http://passportjs.org/) - Authentication middleware

### Database
- [MongoDB](https://www.mongodb.com/) - a NoSQL database
