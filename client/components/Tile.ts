import { defineComponent } from 'vue';

export const Tile = defineComponent({
    props: ['tile', 'playerColor'],
    'template': `
    <div :data-id="tile.id" class="tile" :class="'tile--' + tile.color" v-trim-whitespace>
        <div class="tile-tasks">
            <div class="tile-pos-wrapper tile-type-cost">
                <div class="tile-cost">{{ tile.cost }}</div>
            </div>

            <template v-for="task in tile.tasks">
                <div v-if="task.isComplete" class="tile-pos-wrapper tile-activated" :class="'tile-activated--'+playerColor">✔</div>
                <div v-else class="tile-pos-wrapper tile-type-task" :class="'tile-task--'+task.requirements.length">
                    <template v-for="(req, index) in task.requirements">
                        <div class="tile-req" :class="'tile-req--' + req + ' tile-req--' + index"></div>
                    </template>
                </div>
            </template>
        </div>
    </div>
    `
});
