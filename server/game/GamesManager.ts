import { Game } from './Game';
import { StorageManager } from '../storage/StorageManager';

export class GameManager {
    private static games: Map<string, Game> = new Map<string, Game>();
    private static playerToGame: Map<string, string> = new Map<string, string>(); 
    private static accountToGames: Map<string, Array<string>> = new Map<string, Array<string>>();

    static doesGameBelongsToAccount(gameId: string, accountId: string): boolean {
        const gameIds = GameManager.accountToGames.get(accountId) || [];
        return gameIds.includes(gameId);
    }

    static getGame(gameId: string): Game | undefined {
        return GameManager.games.get(gameId);
    }

    static getGameByPlayerId(playerId: string): Game | undefined {
        const gameId = GameManager.playerToGame.get(playerId);
        if ( ! gameId) return undefined;
        return GameManager.getGame(gameId);
    }

    static getGamesByAccount(accountId: string): Array<Game> {
        var game: Game | undefined;
        const games: Array<Game> = [];
        const gameIds = GameManager.accountToGames.get(accountId) || [];
        for (let gameId of gameIds) {
            game = GameManager.getGame(gameId);
            if (game) games.push(game);
        }
        return games;

    }

    static setGame(game: Game, save: boolean = false) {
        for (let p of game.players) {
            GameManager.playerToGame.set(p.id, game.id);
            const accountGames = GameManager.accountToGames.get(p.id) || [];
            accountGames.push(game.id);
            GameManager.accountToGames.set(p.account.id, accountGames);

        }
        GameManager.games.set(game.id, game);
        if (save) {
            const storage = StorageManager.get();
            storage.set("games:" + game.id, game.serialize());
        }
    }

    static loadAll(next = () => {}) {
        const storage = StorageManager.get();
        storage.getAll('games:*', (data: Array<string>) => {
            var game: Game;
            let count = 0;
            for (let gameData of data) {
                game = Game.deserialize(gameData);
                GameManager.setGame(game);
                count ++;
            }
            console.log('Loaded ' + count + ' games from db');
            next();
        })
    }
}
