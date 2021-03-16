import { defineComponent } from 'vue';
import { Tile } from './Tile';

export const AvailabilitySlot = defineComponent({
    props: ['id', 'tile', 'isAvailable', 'isSelected'],
    components: {
        Tile
    },
    methods: {
        getCssClass() {
            const classes = ['availability-slot', 'availability-slot--' + this.id];
            if (this.isAvailable) {
                classes.push('availability-slot--available');
            }
            if (this.isSelected) {
                classes.push('availability-slot--selected');
            }
            if (this.tile === '') {
                classes.push('availability-slot--empty');
            }
            return classes.join(' ');
        },
        onClick() {
            if ( ! this.isAvailable) return;
            (this as any).$emit('onSelect', this.tile);
        }
    },
    'template': `
    <div :class="getCssClass()" v-on:click="onClick()">
        <div class="availability-slot-content">
            <template v-if="tile">
                <Tile :tile="tile" />
            </template>
        </div>
    </div>
    `
});
