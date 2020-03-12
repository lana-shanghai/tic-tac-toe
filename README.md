# A simple game of tic-tac-toe.

## Start a game 

Test the game in remix.org.
In order to start the game, any address can call the startGame function with 2 parameters for the row number and column number (0, 1, or 2).
Any number of games can be played simultaneously by any pair of addresses. 
The number of the game is automatically assigned to the initiated game based on the previous game.

## Continue the game 

Any player can continue the game by passing 3 parameters: the number of the game, and the x and y coordinates.
The second player cannot be the same address that initialized the game. 

## Make moves until one of the players wins or a tie occurs

A third address cannot make a move. 
An address that made the last move also cannot make a move. 
Once a player wins, the active status of the game is set to false, and no more moves can be made. 
If a tie occurs, the last player is set to 0 and the game status is set to false. 

## View previous games

The public mapping games allows to see the status of any ongoing or past game. 
Once the game is over, the winner is stored as the last player of the game. 

## Run tests 

Have ganache and truffle installed using npm:

```
npm install -g truffle
npm install -g ganache-cli
```

Run the test blockchain in the terminal:

```
ganache-cli
```

In another terminal window, run:

```
truffle compile
truffle migrate
truffle test
```
