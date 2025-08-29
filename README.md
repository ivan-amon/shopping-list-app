# Shopping List

A full-featured web application where users can register, log in, and manage their shopping lists. Each list includes parameters such as name, description, completion status, and date. Additionally, users can add multiple items to each list, with each item having its own name.

The app supports both server-side rendering (SSR) for standard browser usage and a REST API for integration with tools like Postman or external frontends.

## Purpose

This project was developed to solidify backend development skills, covering:

- Full CRUD operations
- User management, sessions, and cookies
- Security practices such as password encryption and route protection
- Use of relational databases with one-to-many relationships (users > lists > items)
- Implementation of a RESTful API and adherence to the MVC design pattern

## Technologies Used

- **Framework:** Express.js  
- **Database & ORM:** MySQL with Sequelize  
- **View Engine:** Handlebars (for SSR)  
- **Security:** bcrypt  
- **User Management:**
  - `express-session` for SSR version
  - `jsonwebtoken` (JWT) for REST API version

## Author

Developed by Iván Amón.

