import { defineComponent } from 'vue';
import { Button } from './Button';

export const StartSolo = defineComponent({
    data() {
        return {
            isLoading: true,
            gameURL: ''
        } as any;
    },
    components: {
        Button
    },
    mounted() {
        fetch('/api/games/create/solo')
            .then((response) => response.json())
            .then((res) => this.onGameReady(res.data.playerId))
            .catch((_) => alert('Cant create game'));
    },
    methods: {
        onGameReady(playerId: string) {
            this.gameURL = '/game/' + playerId;
            this.isLoading = false;
        }
    },
    'template': `
    <div class="start-solo">
        <label class="start-solo-title">Solo</label>
        <div class="start-solo-content">
            <div class="start-solo-action">
                <template v-if="isLoading">
                    <Button :isDisabled="true">Loading...</Button>
                </template>
                <template v-else>
                    <Button :link="gameURL">Start!</Button>
                </template>
            </div>
            <div class="start-solo-rules">
                <p>
                The solo game consists of 2 phases.
                During the first phase your goal is to activate 8 tiles using as <strong>few moves</strong> as possible.
                </p>
                <p>
                The goal is the same for the second phase, but you will need to use up all remaining activations.
                </p>
            </div>
        </div>
    </div>
    `
});
