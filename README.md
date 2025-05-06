# Tic Tac Toe Game

A classic Tic Tac Toe game with multiple play modes: Human vs Human, Human vs Computer, and Computer vs Computer (Demo).

## Features

- Three game modes: Human vs Human, Human vs Computer, and Computer vs Computer (Demo)
- AI opponent with adjustable difficulty levels
- Responsive design
- Score tracking
- Demo mode with automated play-through

## Installation and Setup

### Prerequisites

- Node.js v14+
- npm

### Installation

1. Clone the repository:
```bash
git clone <repo_url>
cd tic-tac-toe
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
# Server will run on http://localhost:4000
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
# Frontend will be available at http://localhost:5173
```

3. Open your browser and navigate to http://localhost:5173

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Game Modes

- **Human vs Human**: Two players take turns making moves
- **Human vs Computer**: Play against an AI opponent with adjustable difficulty
- **Computer vs Computer (Demo)**: Watch an automated game between two AI players

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Testing**: Jest, Supertest

## License

MIT
