# Tic Tac Toe API Documentation

## Base URL

All endpoints are relative to: `http://localhost:4000`

## Endpoints

### Create a New Game

- **URL**: `/api/game/new`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "mode": "human-human | human-computer | computer-computer",
    "difficulty": "Easy | Medium | Hard"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "gameId": "uuid",
      "board": [null, null, null, null, null, null, null, null, null],
      "currentPlayer": "X",
      "status": "playing",
      "scores": {
        "X": 0,
        "O": 0,
        "ties": 0
      }
    }
    ```

### Get Game State

- **URL**: `/api/game/:gameId`
- **Method**: `GET`
- **URL Parameters**: `gameId=[uuid]`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "gameId": "uuid",
      "board": [null, "X", null, "O", null, null, null, null, null],
      "currentPlayer": "X",
      "status": "playing",
      "scores": {
        "X": 0,
        "O": 0,
        "ties": 0
      },
      "demo": {
        "isActive": false,
        "isPaused": false
      }
    }
    ```
- **Error Response**:
  - **Code**: 404
  - **Content**: `{ "error": "Game not found" }`

### Make a Move

- **URL**: `/api/game/:gameId/move`
- **Method**: `POST`
- **URL Parameters**: `gameId=[uuid]`
- **Request Body**:
  ```json
  {
    "cellIndex": 0-8,
    "player": "X | O"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "gameId": "uuid",
      "board": ["X", null, null, null, null, null, null, null, null],
      "currentPlayer": "O",
      "status": "playing",
      "scores": {
        "X": 0,
        "O": 0,
        "ties": 0
      }
    }
    ```
  - **Win Response**:
    ```json
    {
      "gameId": "uuid",
      "board": ["X", "X", "X", "O", "O", null, null, null, null],
      "currentPlayer": "O",
      "status": "win",
      "winner": "X",
      "scores": {
        "X": 1,
        "O": 0,
        "ties": 0
      }
    }
    ```
  - **Draw Response**:
    ```json
    {
      "gameId": "uuid",
      "board": ["X", "O", "X", "X", "O", "X", "O", "X", "O"],
      "currentPlayer": "O",
      "status": "draw",
      "scores": {
        "X": 0,
        "O": 0,
        "ties": 1
      }
    }
    ```
- **Error Response**:
  - **Code**: 400
  - **Content**: `{ "error": "Invalid move: Cell already occupied" }`
  - **Code**: 404
  - **Content**: `{ "error": "Game not found" }`

### Start Demo

- **URL**: `/api/game/:gameId/demo/start`
- **Method**: `POST`
- **URL Parameters**: `gameId=[uuid]`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "gameId": "uuid",
      "board": [null, null, null, null, null, null, null, null, null],
      "currentPlayer": "X",
      "status": "playing",
      "demo": {
        "isActive": true,
        "isPaused": false,
        "sequence": [
          { "cellIndex": 4, "player": "X" },
          { "cellIndex": 0, "player": "O" },
          ...
        ]
      }
    }
    ```

### Pause Demo

- **URL**: `/api/game/:gameId/demo/pause`
- **Method**: `POST`
- **URL Parameters**: `gameId=[uuid]`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "gameId": "uuid",
      "demo": {
        "isActive": true,
        "isPaused": true
      }
    }
    ```

### Reset Demo

- **URL**: `/api/game/:gameId/demo/reset`
- **Method**: `POST`
- **URL Parameters**: `gameId=[uuid]`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "gameId": "uuid",
      "board": [null, null, null, null, null, null, null, null, null],
      "currentPlayer": "X",
      "status": "playing",
      "demo": {
        "isActive": true,
        "isPaused": false
      }
    }
    ```
