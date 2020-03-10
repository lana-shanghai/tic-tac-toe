pragma solidity ^0.6.0;

import "./SafeMath.sol";

contract TicTacToe {
    
    using SafeMath for uint256;

    /* events */
    
    event GameStarted(uint256);
    event GameFinished(uint256);
    
    struct Game {
        uint256 index; // number of the game
        bool isActive; // a move can be made in a game only if its status is active, it becomes false once the game is over
        address firstPlayer; // the address that initiated the game
        address secondPlayer; // the address that made the second move
        address lastPlayer; // to be able to check that the message sender is not the same player who made the previous move
        uint8[3][3] moves; // 3 by 3 two-dimensional array initialized with 0s
    }
    
    uint256[] public game_idx; // array of the game numbers
    mapping(uint256 => Game) public games; // number of the game and the corresponding game data
    
    /* @dev function to check if one of the players won the game */
    
    modifier validMove(uint256 x_axis, uint256 y_axis) {
        require(x_axis < 3 && x_axis >= 0);
        require(y_axis < 3 && y_axis >= 0);
        _;
    }
    
    function checkIfWon(uint256 index) private view returns (bool) {
        Game storage game = games[index];
        
        for(uint i = 0; i < 3; i++) {
            
            // check for horizontal or vertical winnings
            if (game.moves[i][0] * game.moves[i][1] * game.moves[i][2] == 1 || game.moves[0][i] * game.moves[1][i] * game.moves[2][i] == 1) {
                return true;
            }
            if (game.moves[i][0] * game.moves[i][1] * game.moves[i][2] == 8 || game.moves[0][i] * game.moves[1][i] * game.moves[2][i] == 8) {
                return true;
            }
        }
        
        // check for diagonals
        if (game.moves[0][0] * game.moves[1][1] * game.moves[2][2] == 1 || game.moves[0][2] * game.moves[1][1] * game.moves[2][0] == 1) {
            return true;
        }
        if (game.moves[0][0] * game.moves[1][1] * game.moves[2][2] == 8 || game.moves[0][2] * game.moves[1][1] * game.moves[2][0] == 8) {
            return true;
        }
        
        return false;
    }
    
    function checkIfTie(uint256 index) private view returns (bool) {
        Game storage game = games[index];
        
        // check to see if there are still available moves
        for(uint i = 0; i < 3; i++) {
            if (game.moves[i][0] * game.moves[i][1] * game.moves[i][2] == 0 || game.moves[0][i] * game.moves[1][i] * game.moves[2][i] == 0) {
                return false;
            }
        }
        return true;
    }
    
    
    /* @dev a game starts by any player initiating a new game */
    
    function startGame(uint256 x_axis, uint256 y_axis) public validMove(x_axis, y_axis) returns (string memory, uint256) {
        uint256 index = game_idx.length;
        address firstPlayer = msg.sender;
        games[index] = Game(
            game_idx.length, 
            true, 
            firstPlayer, 
            firstPlayer, 
            firstPlayer, 
            [[0,0,0], [0,0,0], [0,0,0]]
            );
        games[index].moves[y_axis][x_axis] = 1;
        game_idx.push(game_idx.length);
        emit GameStarted(index);
        return("Game number: ", index);
    }
    
    /* @dev only a player different to the first can continue the game; a third player cannot continue the game */
    
    function makeMove(uint256 index, uint256 x_axis, uint256 y_axis) public validMove(x_axis, y_axis) {
        require(games[index].isActive == true); // check that the game is active
        require(!(games[index].lastPlayer == msg.sender)); // make sure that a player isn't doing a second move in a row
        require(games[index].moves[y_axis][x_axis] == 0); // make sure that the move to this location hasn't been made yet
        
        if (games[index].firstPlayer == games[index].secondPlayer && msg.sender != games[index].firstPlayer) {
            games[index].secondPlayer = msg.sender;  // assign the sender of the message to the second player
        } else {
            require(games[index].firstPlayer == msg.sender || games[index].secondPlayer == msg.sender); // check that a third player isn't trying to make a move;
        }
        
        if (games[index].firstPlayer == msg.sender) {
            games[index].moves[y_axis][x_axis] = 1;
            games[index].lastPlayer = msg.sender;
        }
        if (games[index].secondPlayer == msg.sender) {
            games[index].moves[y_axis][x_axis] = 2;
            games[index].lastPlayer = msg.sender;
        }
        // if a player has won set the status of the game to inactive, the winner will be saved as the last player of the game
        if (checkIfWon(index) == true) {
            games[index].isActive = false;
            emit GameFinished(index);
        }
        // check for a tie 
        if (checkIfTie(index) == true) {
            games[index].isActive = false;
            address tie = 0x0000000000000000000000000000000000000000;
            games[index].lastPlayer = tie;
            emit GameFinished(index);
        }
    }
}