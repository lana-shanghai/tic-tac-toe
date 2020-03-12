pragma solidity ^0.5.16;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TicTacToe.sol";

contract TestTicTacToe {

    function testStartGame() public {
        
        TicTacToe game = TicTacToe(DeployedAddresses.TicTacToe());

        bool expectedStatus = true;

        uint index = game.startGame(1, 1);

        bool isActive;
        address firstPlayer;
        address secondPlayer;
        address lastPlayer;

        (index, isActive, firstPlayer, secondPlayer, lastPlayer) = game.games(index);

        Assert.equal(isActive, expectedStatus, "Status not active");

        
    }

}