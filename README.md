
# Full Stack Developer Challenge

## Description
This is my code implementation as a solution to this dev challenge. The App is split into to subfolders: api and client. 

### The API 
This is a Node.js App using Express.js framework and Sequelize ORM to connect to a MYSQL database.

### The Frontend
This is Vue.js application utilizing Vuex as store, Vue-router for navigation and Bootstrap-Vue for UI and reusable components.

### End result 
The end result looks as shown in the image below. To see more about the client API, go to the readme file in the client folder.

![DarkMode](https://dl.dropbox.com/s/jtsjhtneaa6enjb/pp1.png?dl=0=250x250)
![DarkMode](https://dl.dropbox.com/s/accvak9kt5a3qeq/pp2.png?dl=0=250x250)

## Specified Requirements
Below are the specified requirements and in parenthesis are the ones I have duely attempted
### Admin view
- [x] Admin Add/remove/update/view employees
- [x] Add/update/view performance reviews 
- [x] Assign employees to participate in another employee's performance review

### Employee view
- [x] List of performance reviews requiring feedback
- [ ] Submit feedback

## Challenge Scope
* High level description of design and technologies used

* Server side API (using a programming language and/or framework of your choice)
  * Implementation of at least 3 API calls
    - [x] About 13 API calls implemented

    BaseURL :3000/api
    1. Admin Login: `[POST] /admin/login`
    2. Employee login: `[POST] /emoloyee/login`
    3. Create employee: `[POST] /admin/create-employee`
    4. Fetch all employees: `[GET] /admin/employees`
    5. Fetch one employee: `[GET] /admin/employees/:id`
    6. Edit employee: `[PUT] /admin/employees/:id`
    7. Delete employee: `[DELETE] /admin/employees/:id`
    8. Create Performance review: `[POST] /admin/create-perf-review`
    9. Fetch all performance reviews: `[GET] /admin/perf-reviews`
    10. Fetch one performance review: `[GET] /admin/perf-reviews/:id`
    11. Update one performance review `[PUT] /admin/perf-reviews/:id`
    12. Create/Assign reviewer: `[POST] /admin/create-reviewer`
    13. Get pending reviews: `[GET] /employee/pending-reviews`
    14. Get all assigned reviews `[GET] /employee/assigned-reviews`
    
  * Most full stack web developers at PayPay currently use Java, Ruby on Rails, or Node.js on the server(with MySQL for the database), but feel free to use other tech if you prefer
    - [x] Implemented with Node.js and Express.js Framework with Sequelize ORM for database connection
* Web app
  * Implementation of 2-5 web pages using a modern web framework (e.g. React or Angular) that talks to server side
     - [x] Vue.js has been used as the web framework with about 9 pages
    * This should integrate with your API, but it's fine to use static responses for some of it 
       - [x] The pages integrates well with API on port 3000
* Document all assumptions made
   ```
    Assumptions
    1. Employee accounts are created by either a superadmin or an admin
    2. (1) implies that there's no user registration
    3. Users have a default password of 123456
    4. No user email verification is required
    5. A Performance review can have more than 1 feedback
    6. An employee cannot be assigned 2x to the same performance review
    7. Performance reviews are created/evaluated before being assigned
    8. Assignees are only to provide feedback on the evaluated performance review
   ```
## Abstract Diagram
![DarkMode](https://dl.dropbox.com/s/wrl93ywncb42g8x/Paypay-2.png?dl=0=250x250)

## Test Code
Not done
