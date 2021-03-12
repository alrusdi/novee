import { Tile } from '../tiles/Tile';
import { Account } from '../account/Account';

export enum PlayerColor {
    Green = 'green',
    Black = 'black',
    Pink = 'pink',
    Orange = 'orange',
    Violet = 'violet'
}

export const ALL_PLAYER_COLORS = [
    PlayerColor.Green,
    PlayerColor.Black,
    PlayerColor.Pink,
    PlayerColor.Orange,
    PlayerColor.Violet
]

export const MAX_ACTIVE_TILES = 21;

export class Player {
    public tiles: Array<Tile> = [];
    public tileInHand: Tile | undefined = undefined;

    constructor(
        public id: string,
        public account: Account,
        public color: PlayerColor
    ) {}
}
