# ExpressNote

![ExpressNote User Login](client/src/assets/Login.png)
![ExpressNote Interface](client/src/assets/NoteContainer.png)

Say goodbye to static note chaos—ExpressNote transforms your developer workflow by blending code, text, and images into dynamic, customizable pages.

## Features

- Authentication (Local & Google OAuth)
- Rich Content Blocks
  - Text Editor
  - Code Editor
  - Image Viewer
  - Terminal
- Grid-based Layout for Formatting
- Multi-page Notes
- PDF Export
- Component Recycling System

## Tech Stack

### Backend
- Node.js & Express
- PostgreSQL
- JWT Authentication
- Google OAuth 2.0
- Vitest for Testing

### Frontend
- React 19
- Slate & Slate-React (Rich Text Editor)
- DaisyUI & Tailwind CSS
- React Grid Layout
- React Router DOM
- React Colorful (Color Picker)
- React PDF Renderer
- Heroicons
- Animated GIF icons from Flaticon

### Development & Testing
- Vite
- Vitest
- React Testing Library
- Jest DOM
- JSDOM
- ESLint
- PostCSS
- Autoprefixer

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   ```

3. Create `.env` file with required variables:
   ```
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=express_note
   DB_USER=your_username
   DB_PASSWORD=your_password

   # Authentication
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Generate secrets:
   ```bash
   # JWT Secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

   # Session Secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. Start the development servers:
   ```bash
   # Start backend server
   npm start

   # Start frontend server (in client directory)
   cd client
   npm run dev
   ```

## Testing

### Backend Testing
The backend uses Vitest for testing with the following test suites:
- **Server Tests**: Integration tests for API endpoints
- **Auth Tests**: Authentication flow tests
- **Controller Tests**: Unit tests for note, page, and block controllers
- **Database Tests**: Database connection and query tests

Run backend tests with:
```bash
npm run test
```

### Frontend Testing
The frontend uses Vitest and React Testing Library for component testing:
- **Component Tests**: Basic rendering and interaction tests
- **Integration Tests**: Component interaction tests

Run frontend tests with:
```bash
cd client
npm run test
```

## Development Tools

### Backend Testing
- Vitest: Test runner
- Axios Mock Adapter: Mock HTTP requests
- Node Mocks HTTP: Mock Express middleware
- pg-mem: Mock PostgreSQL database

### Frontend Development
- Slate: Rich text editor
- DaisyUI: UI components and styling
- React Grid Layout: Grid system
- react-pdf: PDF export functionality
- Vitest & React Testing Library: Frontend testing

## Project Structure

```
server/
├── controllers/     # Route controllers
├── db/             # Database configuration
├── middleware/     # Express middleware
├── routes/         # API routes
├── __tests__/      # Test files
│   ├── unit/      # Unit tests
│   └── setup.js   # Test setup
└── server.js       # Entry point

client/
├── src/
│   ├── components/ # React components
│   ├── pages/      # Page components
│   ├── services/   # API services
│   └── assets/     # Static assets
├── __test__/       # Frontend test files
└── vite.config.js  # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.