import { TileDealer } from '../tiles/TileDealer';
import { Player } from './Player';

export class Game {
    public id: string;
    public round: number = 1;
    public dealer: TileDealer;

    constructor(
        public players: Array<Player>,
        public firstPlayer: Player
    ) {
        this.id = Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
        this.dealer = new TileDealer();

        this.firstPlayer.tiles.push(this.dealer.dealTile());
    }

}