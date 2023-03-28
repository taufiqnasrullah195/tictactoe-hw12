import React, { createContext, useContext, useReducer } from "react";
import { Box, Button, Flex, Container, Heading, Text } from "@chakra-ui/react";
import './App.css';

const GameContext = createContext();

const initialState = {
  squares: Array(9).fill(null),
  xIsNext: true,
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_SQUARE":
      const squares = [...state.squares];
      squares[action.payload] = state.xIsNext ? "X" : "O";
      return { ...state, squares, xIsNext: !state.xIsNext };
    case "RESTART":
      return initialState;
    default:
      return state;
  }
};

const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const selectSquare = (square) => {
    if (state.squares[square] || calculateWinner(state.squares)) {
      return;
    }
    dispatch({ type: "SELECT_SQUARE", payload: square });
  };

  const restart = () => {
    dispatch({ type: "RESTART" });
  };

  return (
    <GameContext.Provider value={{ state, selectSquare, restart }}>
      {children}
    </GameContext.Provider>
  );
};

const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

function Board() {
  const { state, selectSquare, restart } = useGame();
  const { squares, xIsNext } = state;

  const winner = calculateWinner(squares);
  const status = calculateStatus(winner, squares, xIsNext);

  function renderSquare(i) {
    return (
      <Button
        size="lg"
        fontSize="4xl"
        fontWeight="bold"
        colorScheme="teal"
        variant="outline"
        className="square"
        onClick={() => selectSquare(i)}
      >
        {squares[i]}
      </Button>
    );
  }

  return (
    <Box bg="gray.100" h="100vh">
      <Container className="container" maxW="container.lg" textAlign="center" my="8">
        <Heading className="heading" as="h1" size="3xl" mb="4" color="teal.500">
          Tic Tac Toe
        </Heading>
        <Text className="statusPlayer" fontSize="2xl" fontWeight="semibold" mb="4">
          {status}
        </Text>
        <Flex direction="column" alignItems="center">
          <Flex>
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </Flex>
          <Flex>
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </Flex>
          <Flex>
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </Flex>
        </Flex>

        <Button className="btn-restart" colorScheme="teal" size="lg" mt="8" onClick={restart}>
          Restart
        </Button>
      </Container>
    </Box>
  );
}

const calculateStatus = (winner, squares, xIsNext) => {
  if (winner) {
    return `Menang: ${winner}`;
  } else if (squares.every((square) => square !== null)) {
    return "Seri!";
  } else {
    return `Pemain : ${xIsNext ? "X" : "O"}`;
  }
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

function Game() {
  return (
    <div>
      <Board />
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

export default App;
