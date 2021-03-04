import { Tile } from './Tile';
import tileConfigs from '../../data/tiles.json'
import { shuffle } from '../Utils';
import { TileConfig } from './TileConfig';


export class TileDealer {
    private tiles: Array<Tile> = [];
    private discardedTiles: Array<Tile> = [];

    constructor() {
        for (let config of tileConfigs) {
            this.tiles.push(Tile.fromConfig(config as TileConfig));
        }
        shuffle(this.tiles);
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
