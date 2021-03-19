import { MAX_ACTIVE_TILES, SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT } from '../../game/Const';
import { Game } from '../../game/Game';
import { Player } from '../../game/Player';
import { boardToApi } from './BoardAdapter';
import { ActivationsCountClientModel } from './Interfaces';
import { playerToApi } from './PlayerAdapter';


function activationsCountToApi(game: Game): Array<ActivationsCountClientModel> {
    const activationsCount: Array<ActivationsCountClientModel> = [];
    for (let p of game.players) {
        activationsCount.push({
            playerId: p.id,
            playerName: p.account.nickname,
            playerColor: p.color,
            activationsCount: p.getActivationsCount()
        });
    }
    return activationsCount;
}

export function gameDataToApi(game: Game, player: Player, accountId: string) {
    const curPlayer = game.players.find(p => p.account.id === accountId);
    return {
        gameId: game.id,
        board: boardToApi(game.board),
        activationsCount: activationsCountToApi(game),
        player: playerToApi(player),
        yourPlayerId: curPlayer === undefined ? '' : curPlayer.id,
        activePlayerId: game.getActivePlayer().id,
        isSolo: game.isSolo(),
        soloStage: game.soloStage,
        soloScore: game.soloScore,
        soloActivations: game.getSoloActivationsCount(),
        soloMaxActivations: game.soloStage === 1 ? SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT : MAX_ACTIVE_TILES
    }
}