
# Dictionary App

## Overview
This is a full-stack dictionary application developed as a university project. It allows users to search for word definitions using an external dictionary API. The project features role-based access and user management, implemented via a Node.js backend and a React frontend.

## Features
- **Word Search**: Users can search for definitions, phonetics, and usage examples.
- **Role-based Access**:
  - **Admin**: Can manage users, contributors, and control access to the app.
  - **Contributor**: Can add or edit word definitions.
  - **Unauthenticated Visitor**: Can search for words but with limited access.
- **Like and Dislike System**: Users can like or dislike words.
- **Pagination**: Efficient word listing with pagination.
- **Speech-to-Text**: Users can search for words using their voice.
- **API Integration**: Fetches word data from a third-party dictionary API.
- **Responsive UI**: Fully functional on both mobile and desktop devices.

## Functional Requirements

1. **User Registration and Authentication:**
   - Users can register and log in.
   - Admins can manage contributors and control their access.
   - Token-based authentication (JWT) is used for secure access.

2. **Role Management:**
   - The system supports two roles: `admin` and `contributor`.
   - Admins can manage users and contributors.
   - Contributors can add and manage words in the dictionary.

3. **Word Management:**
   - Admins and contributors can add, update, and delete words with details like pronunciation, meanings, and examples.
   - The system allows uploading MP3 files for word pronunciation.

4. **Search Functionality:**
   - Users can search for words by their headword and get definitions from an external API.
   - Search supports both manual typing and voice input.

5. **Like/Dislike System:**
   - Users can like or dislike words.
   - Each user’s interaction is tracked, ensuring they can only like or dislike a word once.

6. **Speech-to-Text:**
   - Users can use their voice to search for words via the search bar.
   - The system stops recording once the word is recognized.

7. **Pagination for Words:**
   - The system provides paginated lists of words to prevent overloading with large datasets.

## Non-Functional Requirements

1. **Security:**
   - Passwords are hashed using `bcrypt` before storing them in the database.
   - Role-based authorization is enforced for secure access to certain routes (e.g., admin or contributor).

2. **Performance:**
   - The application uses pagination for words to handle large datasets efficiently.
   - API integration fetches word data efficiently without overloading the system.

3. **Usability:**
   - The user interface is responsive, supporting mobile and desktop browsers.
   - The design is intuitive, ensuring easy use for both admins and contributors.

4. **Reliability:**
   - The system ensures data integrity by using proper database models and constraints.
   - Error handling is implemented for consistent user feedback.

5. **Scalability:**
   - The system is scalable to accommodate more users and words with efficient pagination and a solid backend architecture.

6. **Maintainability:**
   - Code is organized using MVC architecture for ease of maintenance.
   - The system is modular, separating concerns like user management, word management, and search functionality.

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
- **Admin**: Full control over the app, including user and contributor management.
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

## License
