import { Tile } from './Tile';
import tileConfigs from '../../data/tiles.json'
import { shuffle } from '../Utils';


export class TileDealer {
    private tiles: Array<Tile> = [];
    private discardedTiles: Array<Tile> = [];

    private constructor() {}

    static fromFile(): TileDealer {
        const tileDealer = new TileDealer();
        for (let def of tileConfigs) {
            const tile = Tile.fromDefinition(def as any);
            tileDealer.tiles.push(tile);
        }
        shuffle(tileDealer.tiles);
        return tileDealer;
    }

    static deserialize(serializedData: string): TileDealer {
        const data = JSON.parse(serializedData);

        const dealer = new TileDealer();
        dealer.tiles = data.tileIds.map((tId: string) => Tile.fromDefinition(tId));
        dealer.discardedTiles = data.discardedTileIds.map((tId: string) => Tile.fromDefinition(tId));

        return dealer;
    }

    public serialize(): string {
        const data = {
            tileIds: this.tiles.map(t => t.id),
            discardedTileIds: this.discardedTiles.map(t => t.id)
        }
        return JSON.stringify(data);
    }

    public getRemainingTilesCount() {
        return this.tiles.length;
    }

    public discard(tile: Tile) {
        this.discardedTiles.push(tile);
    }

    public deal(): Tile {
        let tile = this.tiles.pop();
        if (tile === undefined) {
            this.tiles = this.discardedTiles.slice()
            this.discardedTiles = [];
            shuffle(this.tiles)
            tile = this.tiles.pop()
        }

        if (tile === undefined) throw new Error("Empty tiles array in dealer");
        return tile;
    }
}
