import { defineComponent } from 'vue';
import { ActivationsCountClientModel } from '../../server/api/adapters/Interfaces';
import { MAX_ACTIVE_TILES } from '../../server/game/Const';
import { PlayerColor } from '../../server/game/PlayerColor';

interface PlayerPositionRecord {
    type: 'playerPosition';
    distanceToNexPlayer: number;
}

interface ActivationsCountRecord {
    type: 'activationsCount',
    count: number;
    playerColor: PlayerColor;
    playerId: string;
    isYou: boolean;
}

export const PlayerPositions = defineComponent({
    props: ['playerPositions', 'activationsCount', 'currentPlayerId'],
    methods: {
        getActivationsCountByPlayerId(playerId: string): ActivationsCountClientModel {
            const ac = this.activationsCount.find((ac: ActivationsCountClientModel) => ac.playerId === playerId);
            if (ac === undefined) {
                throw new Error('Activations count not found for player ' + playerId);
            }
            return ac;
        },
        getRecords() {
            const ret: Array<PlayerPositionRecord | ActivationsCountRecord> = [];
            let idx = 0;
            const posCount = this.playerPositions.length;
            for (const pos of this.playerPositions) {
                idx++;
                const ac = this.getActivationsCountByPlayerId(pos.playerId);

                ret.push({
                    type: 'activationsCount',
                    count: MAX_ACTIVE_TILES - Math.min(ac.activationsCount, MAX_ACTIVE_TILES),
                    playerColor: ac.playerColor,
                    playerId: ac.playerId,
                    isYou: ac.playerId === this.currentPlayerId
                });

                if (idx === posCount) continue;

                ret.push({
                    type: 'playerPosition',
                    distanceToNexPlayer: pos.distanceToNextPlayer
                });
            }
            return ret;
        },
        getPlayerActivationCssClass(pos: ActivationsCountRecord): string {
            const classes = ['player-activation', 'player-activation--' + pos.playerColor];

            if (pos.isYou) {
                classes.push('player-activation--current-player');
            }

            return classes.join(' ')

        }
    },
    template: `
    <div class="player-positions">
        <div class="player-positions-title">Turn order</div>
        <div class="player-position" v-for="pos in getRecords()">
            <div v-if="pos.type === 'activationsCount'" class="player-position-activation-wrapper">
                <div :id="'player-position-activation-' + pos.playerId" :class="getPlayerActivationCssClass(pos)">{{ pos.count }}</div>
            </div>
            <div v-else class="player-position-distance-wrapper">
                <div class="player-position-distance">{{ pos.distanceToNexPlayer }}</div>
            </div>
        </div>
    </div>
    `
});
