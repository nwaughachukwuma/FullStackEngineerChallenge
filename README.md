
# Full Stack Developer Challenge

## Description
This is my code implementation as a solution to this dev challenge. The App is split into to subfolders: api and client. 

### The API 
This is a Node.js App using Express.js framework and Sequelize ORM to connect to a MYSQL database.

### The Frontend
This is Vue.js application utilizing Vuex as store, Vue-router for navigation and Bootstrap-Vue for UI and reusable components.

### End result 
The end result looks as shown in the image below. To see more about the client API, go to the readme file in the client folder.
![DarkMode](https://s2.aconvert.com/convert/p3r68-cdx67/tb7ph-pcar4.png?dl=0=250x250)
![DarkMode](https://s2.aconvert.com/convert/p3r68-cdx67/t6yhi-9rhbd.png?dl=0=250x250)

## Specified Requirements
Below are the specified requirements and in parenthesis are the ones I have duely attempted
### Admin view
[x] Admin Add/remove/update/view employees
[x] Add/update/view performance reviews 
[x] Assign employees to participate in another employee's performance review

### Employee view
[x] List of performance reviews requiring feedback
[ ] Submit feedback

## Challenge Scope
* High level description of design and technologies used

* Server side API (using a programming language and/or framework of your choice)
  * Implementation of at least 3 API calls
    [x] About 13 API calls implemented
  * Most full stack web developers at PayPay currently use Java, Ruby on Rails, or Node.js on the server(with MySQL for the database), but feel free to use other tech if you prefer
    [x] Implemented with Node.js and Express.js Framework with Sequelize ORM for database connection
* Web app
  * Implementation of 2-5 web pages using a modern web framework (e.g. React or Angular) that talks to server side
     [x] Vue.js has been used as the web framework with about 9 pages
    * This should integrate with your API, but it's fine to use static responses for some of it 
       [x] The pages integrates well with API on port 3000
* Document all assumptions made
   ```
    Assumptions
    1. Employee accounts are created by either a superadmin or an admin
    2. (1) implies that there's no user registration
    3. Users have a default password of 123456
    4. No user email verification is required
    5. A Performance review can have more than 1 feedback
    6. An employee cannot be assigned 2x to the same performance review
   ```
## Abstract Diagram

