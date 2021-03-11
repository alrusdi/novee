import { defineComponent } from 'vue';

export const Game = defineComponent({
    'template': `
        <div class="game-container">
            <div class="tile">
                <div class="tile-pos-wrapper tile-type-cost">
                    <div class="tile-cost">7</div>
                </div>
                <div class="tile-pos-wrapper tile-type-task">
                    <div class="tile-task tile-task--red"></div><div class="tile-task tile-task--blue"></div><div class="tile-task tile-task--turquoise"></div>
                </div>
                
                <div class="tile-pos-wrapper tile-type-task">
                    <div class="tile-task"></div><div class="tile-task"></div><div class="tile-task"></div><div class="tile-task"></div>
                </div>
                
                <div class="tile-pos-wrapper tile-type-task">
                    <div class="tile-task"></div>
                </div>
            </div>
        </div>
    `
});
