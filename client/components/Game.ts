import { defineComponent } from 'vue';
import { Tile } from './Tile';
import { TilePlaceholder } from './TilePlaceholder';
import { AvailabilitySlot } from './AvailabilitySlot';
import { TileClientModel } from '../../server/api/adapters/Interfaces';

export const Game = defineComponent({
    data() {
        return {
            isLoading: true,
            selectedTileId: '',
            availabilitySlots: [],
            tileset: [],
            playerColor: "",
            isSolo: false,
            soloScore: 0,
            soloStage: 1
        } as any;
    },
    mounted() {
        const playerId = window.location.href.split('/game/')[1];
        fetch('/api/games/get-by-player/' + playerId)
            .then((response) => response.json())
            .then((res) => this.onGameReady(res))
            .catch((_) => alert('Can\'t get game'));
    },
    methods: {
        onGameReady(gameInfo: any) {
            console.log(gameInfo);
            this.availabilitySlots = gameInfo.data.board.availabilitySlots;
            this.tileset = gameInfo.data.player.tileset;
            this.playerColor = gameInfo.data.player.color;
            this.isSolo = gameInfo.data.isSolo;
            this.soloScore = gameInfo.data.soloScore;
            this.soloStage = gameInfo.data.soloStage;
            this.soloActivations = gameInfo.data.soloActivations;
            this.soloMaxActivations = gameInfo.data.soloMaxActivations;
            this.isLoading = false;
            this.selectedTileId = '';
        },
        isPlaceSelectable(tile: any) {
            if ((this as any).selectedTileId === '') return false;
            if (tile.tileId === '') return false;
            return true;
        },
        isTileSelected(tile: TileClientModel) {
            if (tile.id === this.selectedTileId) return true;
            return false;
        },
        onTileSelected(tile: TileClientModel) {
            this.selectedTileId = tile.id;
        },
        onTilePlaceholderSelected(targetTile: any) {
            console.log('Selected', targetTile);
            const playerId = window.location.href.split('/game/')[1];
            const newTileId = this.selectedTileId;
            const targetTileId = targetTile.tileId;
            const side = targetTile.side;
            const urlParts = [
                '/api/games/place-tile',
                playerId,
                newTileId,
                targetTileId,
                side
            ]
            const url = urlParts.join('/')
            fetch(url)
                .then((response) => response.json())
                .then((res) => this.onGameReady(res))
                .catch((_) => alert('Can\'t place the tile'));
        }
    },
    components: {
        Tile,
        TilePlaceholder,
        AvailabilitySlot
    },
    'template': `
        <div class="game-container" v-trim-whitespace>
            <template v-if="isLoading">
                <div>Hello! It is loading...</div>
            </template>

            <template v-else>
            <div class="game-block game-block--availability">
                <div class="tiles-available-wrapper">
                    <template v-for="(avSlot, index) in availabilitySlots">
                        <AvailabilitySlot
                            @onSelect="onTileSelected"
                            :tile="avSlot.tile"
                            :id="index"
                            :isAvailable="avSlot.isAvailable"
                            :isSelected="isTileSelected(avSlot.tile)" />
                    </template>
                    <div class="game-stats-container">
                        <p>Solo stage: {{ soloStage }}</p>
                        <p>Solo score: {{ soloScore }}</p>
                        <p><div class="game-activations-counter tile-activated" :class="'tile-activated--'+playerColor"></div> {{ soloActivations }} / {{ soloMaxActivations }}</p>
                    </div>
                </div>
            </div>
            <div class="game-block game-block--tiles">
                <div class="tiles-wrapper">
                    <div class="tiles-container">
                        <div class="tiles-line" v-for="tilesLine in tileset">
                            <template v-for="tile in tilesLine">
                                <template v-if="tile.id">
                                    <Tile :tile="tile" :playerColor="playerColor" />
                                </template>
                                <template v-else>
                                    <TilePlaceholder @onSelect="onTilePlaceholderSelected" :targetTile="tile" :isTarget="isPlaceSelectable(tile)" />
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            </template>
        </div>
    `
});
