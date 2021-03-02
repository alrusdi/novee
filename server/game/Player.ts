import { Tile } from '../tiles/Tile';

enum PlayerColor {
    Red = "red",
    Green = "green",
    Black = "black",
    White = "white",
    Pink = "pink",
    Orange = "orange",
    Blue = "orange",
    Yellow = "yellow"
}

export class Player {
    id: string = '';
    color: PlayerColor = PlayerColor.Black;
    tiles: Array<Tile> = [];
    account: Account | undefined = undefined;
}