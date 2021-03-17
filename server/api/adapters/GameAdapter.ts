import { SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT } from '../../game/Const';
import { Game } from '../../game/Game';
import { MAX_ACTIVE_TILES, Player } from '../../game/Player';
import { boardToApi } from './BoardAdapter';
import { playerToApi } from './PlayerAdapter';

export function gameDataToApi(game: Game, player: Player) {
    return {
        gameId: game.id,
        board: boardToApi(game.board),
        player: playerToApi(player),
        isSolo: game.isSolo(),
        soloStage: game.soloStage,
        soloScore: game.soloScore,
        soloActivations: game.getSoloActivationsCount(),
        soloMaxActivations: game.soloStage === 1 ? SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT : MAX_ACTIVE_TILES
    }
}