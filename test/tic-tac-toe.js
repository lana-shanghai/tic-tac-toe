const assertRevert = require('./utils/assertRevert').assertRevert;
var TicTacToe = artifacts.require('../contracts/TicTacToe.sol');

contract('TicTacToe', function(accounts) {
	

    it("starts a game", () => {
        var newGame;
        var ind = 0;
        return TicTacToe.deployed().then((instance) => {
            newGame = instance;
            return newGame.startGame(1, 1, {from: accounts[0]});
        }).then((result) => {
            eventLogs = result.logs[0];
            assert.equal(ind, eventLogs['args'][0].toNumber())
            assert.equal(true, eventLogs['args'][1], "The game did not become active.");
            assert.equal(accounts[0], eventLogs['args'][2], "First player was not logged correctly.");
            assert.equal(1, eventLogs['args'][3][1][1].toNumber(), "It doesn't change the game field to the first player's move.")
        });
    });

    it("does not allow two moves in a row for the same address", () => {
        var ind = 1;
        var newGame;
        return TicTacToe.deployed().then((instance) => {
            newGame = instance;
            newGame.startGame(1, 1, {from: accounts[2]});
            newGame.makeMove(ind, 1, 2, {from: accounts[3]});
            newGame.makeMove(ind, 2, 2, {from: accounts[2]});
            assertRevert(newGame.makeMove(ind, 0, 0, {from: accounts[2]}));
        });
    });

    it("changes the second player to the message sender correctly", () => {
        var ind = 2;
        var newGame;
        return TicTacToe.deployed().then((instance) => {
            newGame = instance;
            newGame.startGame(1, 1, {from: accounts[0]});
            newGame.makeMove(ind, 1, 2, {from: accounts[1]});
            return newGame.games(ind);
        }).then((result) => {
            logs = result;
            assert.equal(accounts[1], logs['lastPlayer'], "Last player was not logged correctly.");
            assert.equal(accounts[1], logs['secondPlayer'], "Second player was not logged correctly.");
            assert.equal(accounts[0], logs['firstPlayer'], "First player was not logged correctly.");

        });
    });

    it("does not let a third player make a move", () => {
        var ind = 3;
        var newGame;
        return TicTacToe.deployed().then((instance) => {
            newGame = instance;
            newGame.startGame(1, 1, {from: accounts[0]});
            newGame.makeMove(ind, 1, 2, {from: accounts[1]});
            assertRevert(newGame.makeMove(ind, 0, 0, {from: accounts[2]}));
        });
    });

    it("does not allow a move onto a field that is already taken", () => {
        var ind = 4;
        var newGame;
        return TicTacToe.deployed().then((instance) => {
            newGame = instance;
            newGame.startGame(1, 1, {from: accounts[0]});
            newGame.makeMove(ind, 1, 2, {from: accounts[1]});
            newGame.makeMove(ind, 2, 2, {from: accounts[0]});
            assertRevert(newGame.makeMove(ind, 1, 2, {from: accounts[1]}));
        });
    });


    it("sets game status to false and logs the last player if the game is won", () => {
        var ind = 5;
        var newGame;
        return TicTacToe.deployed().then((instance) => {
            newGame = instance;
            newGame.startGame(1, 1, {from: accounts[0]});
            newGame.makeMove(ind, 1, 2, {from: accounts[1]});
            newGame.makeMove(ind, 2, 2, {from: accounts[0]});
            newGame.makeMove(ind, 2, 1, {from: accounts[1]});
            newGame.makeMove(ind, 0, 0, {from: accounts[0]});
            return newGame.games(ind);
        }).then((result) => {
            logs = result;
            assert.equal(accounts[0], logs['lastPlayer'], "Last player was not logged correctly.");
            assert.equal(false, logs['isActive'], "Status was not set to false.");
        });
    });

    it("sets game status to false and the last player to 0 if there is a tie", () => {
        var ind = 6;
        var newGame;
        return TicTacToe.deployed().then((instance) => {
            newGame = instance;
            newGame.startGame(1, 1, {from: accounts[0]});
            newGame.makeMove(ind, 1, 2, {from: accounts[1]});
            newGame.makeMove(ind, 2, 2, {from: accounts[0]});
            newGame.makeMove(ind, 0, 0, {from: accounts[1]});
            newGame.makeMove(ind, 0, 2, {from: accounts[0]});
            newGame.makeMove(ind, 2, 1, {from: accounts[1]});
            newGame.makeMove(ind, 0, 1, {from: accounts[0]});
            newGame.makeMove(ind, 1, 0, {from: accounts[1]});
            newGame.makeMove(ind, 2, 0, {from: accounts[0]});
            return newGame.games(ind);
        }).then((result) => {
            logs = result;
            assert.equal(false, logs['isActive'], "Status was not set to false.");
            assert.equal("0x0000000000000000000000000000000000000000", logs['lastPlayer'], "Last player was not logged correctly.");
        });
    });

    it("does not allow a move after the game is won", () => {
        var ind = 7;
        var newGame;
        return TicTacToe.deployed().then((instance) => {
            newGame = instance;
            newGame.startGame(1, 1, {from: accounts[0]});
            newGame.makeMove(ind, 1, 2, {from: accounts[1]});
            newGame.makeMove(ind, 2, 2, {from: accounts[0]});
            newGame.makeMove(ind, 2, 1, {from: accounts[1]});
            newGame.makeMove(ind, 0, 0, {from: accounts[0]});
            assertRevert(newGame.makeMove(ind, 0, 2, {from: accounts[1]}));
        });
    });

    it("emits GameFinished when the game is won", () => {
        var newGame;
        var ind = 8;
        return TicTacToe.deployed().then((instance) => {
            newGame = instance;
            newGame.startGame(1, 1, {from: accounts[0]});
            newGame.makeMove(ind, 1, 2, {from: accounts[1]});
            newGame.makeMove(ind, 2, 2, {from: accounts[0]});
            newGame.makeMove(ind, 2, 1, {from: accounts[1]});
            return newGame.makeMove(ind, 0, 0, {from: accounts[0]});
        }).then((result) => {
            eventLogs = result.logs[1];
            assert.equal('GameFinished', eventLogs['event'], 'Event GameFinished was not emitted.')
        });
    });

    it("emits GameFinished when there is a tie", () => {
        var newGame;
        var ind = 9;
        return TicTacToe.deployed().then((instance) => {
            newGame = instance;
            newGame.startGame(1, 1, {from: accounts[0]});
            newGame.makeMove(ind, 1, 2, {from: accounts[1]});
            newGame.makeMove(ind, 2, 2, {from: accounts[0]});
            newGame.makeMove(ind, 0, 0, {from: accounts[1]});
            newGame.makeMove(ind, 0, 2, {from: accounts[0]});
            newGame.makeMove(ind, 2, 1, {from: accounts[1]});
            newGame.makeMove(ind, 0, 1, {from: accounts[0]});
            newGame.makeMove(ind, 1, 0, {from: accounts[1]});
            return newGame.makeMove(ind, 2, 0, {from: accounts[0]});
        }).then((result) => {
            eventLogs = result.logs[1];
            assert.equal('GameFinished', eventLogs['event'], 'Event GameFinished was not emitted.')
        });
    });
});
