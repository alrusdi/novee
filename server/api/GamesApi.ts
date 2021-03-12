import { AccountManager } from '../account/AccountManager';
import { Game } from '../game/Game';
import { GameManager } from '../game/GamesManager';
import { Player, PlayerColor } from '../game/Player';
import { randomId } from '../Utils';
import { BaseApi } from './BaseApi';
import { ApiResponse } from './Interfaces';

export class GamesApi extends BaseApi {
    createSoloGame(): ApiResponse {
        const account = AccountManager.getById(this.accountId);
        if (account === undefined) {
            return {
                status: 'Fail',
                message: 'Can\'t get account',
                data: {}
            }
        }
        const player = new Player(
            randomId(),
            account,
            PlayerColor.Orange
        )
        const game = new Game([player], player);
        GameManager.setGame(game);

        return {
            status: 'Ok',
            message: 'Game created successfully',
            data: {
                gameId: game.id
            }
        }
    }
}
