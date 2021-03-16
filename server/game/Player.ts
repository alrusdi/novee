import { TilesetData, Task, Tile } from '../tiles/Tile';
import { Account } from '../account/Account';
import { AccountManager } from '../account/AccountManager';
import { PlayerColor } from './PlayerColor';

export const MAX_ACTIVE_TILES = 21;

export class Player {
    public rootTile: Tile | undefined;
    public tileInHand: Tile | undefined = undefined;

    constructor(
        public id: string,
        public account: Account,
        public color: PlayerColor
    ) {}

    getActivationsCount(preCalculatedTilesetData: TilesetData | undefined = undefined): number {
        let tilesetData = preCalculatedTilesetData;
        if (tilesetData === undefined) {
            if (this.rootTile === undefined) return 0;
            tilesetData = this.rootTile.getTilesetData()
        }
        let activationsCount = 0;
        for (let tile of tilesetData.tiles.values()) {
            tile.tasks.map((task: Task) => {task.isComplete() ? activationsCount += 1 : 0})
        }
        return activationsCount;
    }

    serialize(): string {
        const data = {
            id: this.id,
            accountId: this.account.id,
            color: this.color,
            tileInHandId: this.tileInHand ? this.tileInHand.id : undefined,
            rootTile: this.rootTile?.serialize()
        }
        return JSON.stringify(data)
    }

    static deserialize(serializedPlayer: string): Player {
        const data = JSON.parse(serializedPlayer);
        const account = AccountManager.getById(data.accountId);
        if (account === undefined) throw new Error('Can\'t restore player\'s account');
        const player = new Player(data.id, account, data.color);
        if (data.rootTile) {
            player.rootTile = Tile.deserialize(data.rootTile)
        }
        return player;
    }
}
