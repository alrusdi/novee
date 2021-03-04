import { TileDealer } from '../tiles/TileDealer';
import { randomId } from '../Utils';
import { Player } from './Player';

export class Game {
    public id: string;
    public round: number = 1;
    public dealer: TileDealer;

    constructor(
        public players: Array<Player>,
        public firstPlayer: Player
    ) {
        this.id = randomId();
        this.dealer = new TileDealer();

        this.firstPlayer.tiles.push(this.dealer.deal());
    }
}