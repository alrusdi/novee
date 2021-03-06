import { PlayerColor } from '../../game/PlayerColor';
import { Side } from '../../tiles/Side';
import { TileColor } from '../../tiles/TileColor';

export interface TaskClientModel {
    requirements: Array<TileColor>
    isComplete: boolean;
}

export interface TilePlaceholder {
    tileId: string | undefined;
    side: Side | undefined;
}

export interface TileClientModel {
    id: string;
    cost: number;
    color: TileColor;
    tasks: Array<TaskClientModel>
}

export interface PlayerClientModel {
    id: string;
    color: PlayerColor;
    tileset: Array<Array<TileClientModel | TilePlaceholder>>;
    activationsRemaining: number;
}

export interface AvailabilitySlotClientModel {
    isAvailable: boolean;
    tile: TileClientModel | "";
}

export interface PlayerPositionClientModel {
    playerId: string;
    distanceToNextPlayer: number;
}

export interface BoardClientModel {
    availabilitySlots: Array<AvailabilitySlotClientModel>;
    playerPositions: Array<PlayerPositionClientModel>
}

export interface ActivationsCountClientModel {
    playerId: string;
    playerName: string;
    playerColor: PlayerColor;
    activationsCount: number;
}
