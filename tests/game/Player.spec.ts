import { expect } from 'chai';
import { Account } from '../../server/account/Account';
import { Game } from '../../server/game/Game';
import { Player } from '../../server/game/Player';
import { PlayerColor } from '../../server/game/PlayerColor';
import { randomId } from '../../server/Utils';

describe('Player', function() {
    it('is serializable', function() {
        const account = new Account("hello_open_id");

        const player = new Player(
            randomId(),
            account,
            PlayerColor.Orange
        )
        const game = Game.newGame([player])
        expect(game.players.length).to.eq(1);
        expect(game.players[0].id).to.eq(player.id);
    });
});