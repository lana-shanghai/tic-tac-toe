# A simple game of tic-tac-toe.

## Start a game 

In order to start the game, any address can call the startGame function with 2 parameters for the row number and column number (0, 1, or 2).
Any number of games can be played simultaneously by any pair of addresses. 
The number of the game is automatically assigned to the initiated game based on the previous game.

## Continue the game 

Any player can continue the game.
The second player cannot be the same address that initialized the game. 

## Make moves until one of the players wins 

A third address cannot make a move. 
An address that made the last move also cannot make a move. 
Once a player wins, the active status of the game is set to false, and no more moves can be made. 

## View previous games

The public mapping games allows to see the status of any ongoing or past game. 
Once the game is over, the winner is stord as the last player of the game. 