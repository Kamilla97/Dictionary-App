
# Dictionary App

## Overview
This is a full-stack dictionary application developed as a university project. It allows users to search for word definitions using an external dictionary API. The project features role-based access and user management, implemented via a Node.js backend and a React frontend.

## Features
- **Word Search**: Users can search for definitions, phonetics, and usage examples.
- **Role-based Access**:
  - **Admin**: Can manage users and control access to the app.
  - **Contributor**: Can add or edit word definitions.
  - **Unauthenticated Visitor**: Can search for words but with limited access.
- **API Integration**: Fetches word data from a third-party dictionary API.
- **Responsive UI**: Fully functional on both mobile and desktop devices.

## Project Structure
The project is divided into two main directories:
1. **Backend**: Built with Node.js and Express.
2. **Frontend**: Built with React for the user interface.

## Backend
- Built with Node.js and Express.
- Manages user authentication, role-based access, and interacts with the dictionary API.

### To run the backend:
```bash
cd backend/
npm install
npm run start
```

## Frontend
- Built with React.
- Provides a dynamic user interface, handles API responses, and manages user interactions.

### To run the frontend:
```bash
cd frontend/
npm install
npm run start
```

## Technologies Used
- **Frontend**: React, CSS, HTML
- **Backend**: Node.js, Express
- **Authentication**: Role-based access control for different user types (Admin, Contributor, Visitor)
- **API**: External dictionary API for fetching word data https://dictionaryapi.dev/
- **Version Control**: Git

## User Roles
- **Admin**: Full control over the app, including user management and role assignments.
- **Contributor**: Can submit new words and update definitions.
- **Unauthenticated Visitor**: Limited to searching for word definitions.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Kamilla97/Dictionary-App.git
   ```

2. Set up both the backend and frontend:

### Backend:
```bash
cd backend/
npm install
npm run start
```

### Frontend:
```bash
cd frontend/
npm install
npm run start
```

## Contributions
-
## License
-
