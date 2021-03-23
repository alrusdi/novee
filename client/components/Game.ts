import { defineComponent } from 'vue';
import { Tile } from './Tile';
import { TilePlaceholder } from './TilePlaceholder';
import { AvailabilitySlot } from './AvailabilitySlot';
import { PlayerPositions } from './PlayerPositions';
import { ActivationsCountClientModel, TileClientModel } from '../../server/api/adapters/Interfaces';
import { PlayerColor } from '../../server/game/PlayerColor';

interface PlayerModel {
    id: string;
    name: string;
    color: PlayerColor;
    activationsCount: number;
    isDummy: boolean;
}

export const Game = defineComponent({
    data() {
        return {
            playerPositions: [],
            availabilitySlots: [],
            activationsCount: [],
            tileset: [],
            playerColor: "",
            you: undefined,
            canRefreshTiles: false,
            activePlayer: undefined,
            isYourTurn: false,
            isSolo: false,
            soloScore: 0,
            soloStage: 1,
            soloActivations: 0,
            soloMaxActivations: 0,
            selectedTileId: '',
            isLoading: true
        } as any;
    },
    mounted() {
        this.updateGame();
    },
    methods: {
        updateGame() {
            const playerId = window.location.href.split('/game/')[1];
            fetch('/api/games/get-by-player/' + playerId)
                .then((response) => response.json())
                .then((res) => this.onGameReady(res))
                .catch((_) => alert('Can\'t get game'));
        },
        getDummyPlayer(): PlayerModel {
            return {
                id: "",
                name: "dummy",
                color: PlayerColor.Orange,
                activationsCount: 0,
                isDummy: true
            }
        },
        getPlayer(playerId: string): PlayerModel {
            const ac: ActivationsCountClientModel | undefined = this.activationsCount.find(
                (ac: ActivationsCountClientModel) => ac.playerId === playerId
            );
            if (ac === undefined) return this.getDummyPlayer();
            return {
                id: ac.playerId,
                name: ac.playerName,
                color: ac.playerColor,
                activationsCount: ac.activationsCount,
                isDummy: false
            }
        },
        onGameReady(gameInfo: any) {
            this.playerPositions = gameInfo.data.board.playerPositions;
            this.availabilitySlots = gameInfo.data.board.availabilitySlots;
            this.activationsCount = gameInfo.data.activationsCount;
            this.tileset = gameInfo.data.player.tileset;
            this.you = this.getPlayer(gameInfo.data.yourPlayerId);
            this.activePlayer = this.getPlayer(gameInfo.data.activePlayerId);
            this.isYourTurn = this.you.id === this.activePlayer.id;
            this.isSolo = gameInfo.data.isSolo;
            this.soloScore = gameInfo.data.soloScore;
            this.soloStage = gameInfo.data.soloStage;
            this.soloActivations = gameInfo.data.soloActivations;
            this.soloMaxActivations = gameInfo.data.soloMaxActivations;

            this.selectedTileId = '';
            this.isLoading = false;
            this.canRefreshTiles = this.isYourTurn && gameInfo.data.canRefreshTiles;

            if ( ! this.isYourTurn) {
                setTimeout(() => this.updateGame(), 5000);
            }
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
        },
        getYourMessage() {
            if ( ! this.tileSelected) {
                return 'Select available tile to add to your tileset';
            } else {
                return 'Add selected tile to you tileset';
            }
        },
        refreshTiles() {
            if ( ! this.canRefreshTiles) return;
            const url = '/api/games/refresh-tiles/' + this.you.id;
            fetch(url)
                .then((response) => response.json())
                .then((res) => this.onGameReady(res))
                .catch((_) => alert('Can\'t refresh tiles'));
        }
    },
    components: {
        Tile,
        TilePlaceholder,
        AvailabilitySlot,
        PlayerPositions
    },
    'template': `
        <div class="game-container" v-trim-whitespace>
            <template v-if="isLoading">
                <div>Loading...</div>
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
                        <template v-if="isSolo">
                            <p>Stage: {{ soloStage }} / 2</p>
                            <p>Current score: {{ soloScore }}</p>
                            <p><div class="game-activations-counter tile-activated" :class="'tile-activated--'+you.color">✔</div> {{ soloActivations }} / {{ soloMaxActivations }}</p>
                        </template>
                        <template v-else>
                            <PlayerPositions :activationsCount="activationsCount" :playerPositions="playerPositions" />
                            <div class="game-messages-container">
                                <p v-if="isYourTurn" class="game-messages-title">Your turn!</p>
                                <div class="game-messages">
                                    <template v-if="isYourTurn">
                                        <div class="games-message">
                                            {{ getYourMessage() }}
                                        </div>
                                        <div class="games-message" v-if="canRefreshTiles">
                                            Also, you can <a class="game-refresh-tiles" href="#" v-on:click.prevent="refreshTiles()">refresh the tiles</a>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="games-message">
                                            Please wait till <em :class="'game-player-name player-color--' + activePlayer.color">{{ activePlayer.name }}</em> finishes his/her turn.
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="game-block game-block--tiles">
                <div class="tiles-wrapper">
                    <div class="tiles-container">
                        <div class="tiles-line" v-for="tilesLine in tileset">
                            <template v-for="tile in tilesLine">
                                <template v-if="tile.id">
                                    <Tile :tile="tile" :playerColor="you.color" />
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
