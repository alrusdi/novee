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
            .then((res) => this.onGameReady(res.data.gameId))
            .catch((_) => alert('Cant create game'));
    },
    methods: {
        onGameReady(gameId: string) {
            this.gameURL = '/game/' + gameId;
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
                Solo game consists of 2 stages. On the first stage your goal is to activate 
                8 tiles using as <strong>least</strong> moves as posible.
                </p>
                <p>
                The same goal is for second stage, but you need to activate 13 tiles.
                </p>

            </div>
        </div>
    </div>
    `
});
