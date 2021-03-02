import { TileColor } from './TileColor';

export interface TileConfig {
    color: TileColor;
    cost: number;
    tasks: Array<Array<TileColor>>
}

const colorFromLetter = (letter: string): TileColor  => {
    switch (letter) {
        case "r": return "red";
        case "b": return "blue";
        case "t": return "turquoise";
        case "y": return "yellow";
        default: throw new Error("Can't build proper color for: '"+ letter +"'");
    }
}

const parseTask = (def: string): Array<TileColor> => {
    /*
        def is something like "2ytb"
        result is expansion on that shortcuts like this:
        ["yellow", "yellow", "turquoise", "blue"]
    */
    const colors: Array<TileColor> = [];
    let repeatNext = 1;
    for (let symbol of def) {
        if (["0", "1", "2", "3", "4"].includes(symbol)) {
            repeatNext = parseInt(symbol);
            continue;
        }
        for (let i = 0; i < repeatNext; i++) {
            colors.push(colorFromLetter(symbol));
        }
    }
    return colors;
}

export const makeTileConfigFromDefinition = (configDefinition: string): TileConfig => {
    let defParts = configDefinition.split("_");
    return {
        "color": colorFromLetter(defParts[0]),
        "cost": parseInt(defParts[1]),
        "tasks": defParts.slice(2, 6).map(parseTask)
    }
}