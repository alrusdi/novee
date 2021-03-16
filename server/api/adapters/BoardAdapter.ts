import { Task, Tile, Requirement } from '../../tiles/Tile';
import { Board, PlayerPosition } from '../../game/Board';
import { TileColor } from '../../tiles/TileColor';
import { TaskClientModel, TileClientModel } from './Interfaces';

interface AvailabilitySlot {
    isAvailable: boolean;
    tile: TileClientModel | "";
}

interface BoardClientModel {
    availabilitySlots: Array<AvailabilitySlot>;
    playerPositions: Array<PlayerPositionClientModel>
}

interface PlayerPositionClientModel {
    playerId: string;
    distanceToNextPlayer: number;
}

function playerPositionsForClient(playerPositions: Array<PlayerPosition>): Array<PlayerPositionClientModel> {
    const ret: Array<PlayerPositionClientModel> = [];
    for (let i=0; i < playerPositions.length; i++) {
        let pos = playerPositions[i];
        let distance = 0;
        if (i + 1 < playerPositions.length) {
            distance = playerPositions[i+1].index - pos.index;
        }
        ret.push({
            'playerId': pos.playerId,
            'distanceToNextPlayer': distance
        })
    }
    return ret;
}


export function requirementsToColors(requirements: Array<Requirement>): Array<TileColor> {
    let colors: Array<TileColor> = [];
    for (let r of requirements) {
        colors = colors.concat(Array<TileColor>(r.count).fill(r.color));
    }
    return colors
}

export function taskForClient(task: Task): TaskClientModel {
    return {
        requirements: requirementsToColors(task.requirements),
        isComplete: task.isComplete()
    }
}

export function tileForClient(tile: Tile): TileClientModel {
    return {
        id: tile.id,
        cost: tile.cost,
        color: tile.color,
        tasks: tile.tasks.map((t: Task) => taskForClient(t))
    }
}

export function boardToApi(board: Board): BoardClientModel {
    const boardData: BoardClientModel = {
        availabilitySlots: [],
        playerPositions: playerPositionsForClient(board.getSortedPlayerPositions())
    }
    const availableTileIds = board.getAvailableTiles().map((t: Tile) => t.id);
    for (let tile of board.getTilesForClient()) {
        let clientTile = tile === undefined ? tile : tileForClient(tile);
        boardData.availabilitySlots.push({
            isAvailable: availableTileIds.includes(clientTile?.id || ""),
            tile: clientTile || ""
        })
    }
    return boardData;
}