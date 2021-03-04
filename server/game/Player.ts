import { Tile } from '../tiles/Tile';

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

export class Player {
    public tiles: Array<Tile> = [];
    public tileInHand: Tile | undefined = undefined;

    constructor(
        public id: string,
        public account: Account,
        public color: PlayerColor
    ) {}
}