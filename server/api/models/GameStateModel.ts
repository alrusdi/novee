import { TileModel } from './TileModel';

export interface GameStateModel {
    round: number;
    remainingTilesCount: number;
    visibleTiles: Array<TileModel>;
    availableTiles: Array<TileModel>;
    availabilityMarkerPosition: number;
    canRedealTiles: boolean;
}
