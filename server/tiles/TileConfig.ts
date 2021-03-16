import { TileColor } from './TileColor';

export interface TileConfig {
    color: TileColor;
    cost: number;
    tasks: Array<Array<TileColor>>
}

export const colorFromLetter = (letter: string): TileColor  => {
    switch (letter) {
        case "r": return "red";
        case "b": return "blue";
        case "t": return "turquoise";
        case "y": return "yellow";
        default: throw new Error("Can't build proper color for: '"+ letter +"'");
    }
}

export const parseColors = (def: string): Array<TileColor> => {
    /*
        def is something like "yytb"
        result is expansion on that shortcuts like this:
        ["yellow", "yellow", "turquoise", "blue"]
    */
    const colors: Array<TileColor> = [];
    for (let symbol of def) {
        colors.push(colorFromLetter(symbol));
    }
    return colors;
}
