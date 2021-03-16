import { expect } from 'chai';
import { Account } from '../../server/account/Account';
import { Dispatcher } from '../../server/api/Dispatcher';
import { Game } from '../../server/game/Game';
import { GameManager } from '../../server/game/GamesManager';
import { Player } from '../../server/game/Player';
import { PlayerColor } from '../../server/game/PlayerColor';
import { randomId } from '../../server/Utils';

describe('GamesAPI', function() {
    it('gets game by valid player id', function() {
        const account = new Account("hello_open_id");

        const player = new Player(
            randomId(),
            account,
            PlayerColor.Orange
        )
        const game = Game.newGame([player])
        GameManager.setGame(game);

        const response = Dispatcher.handleGetRequest(account.id, '/api/games/get-by-player/' + player.id);
        expect(response.status).to.eq('Ok');
    });
});