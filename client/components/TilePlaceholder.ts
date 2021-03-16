import { defineComponent } from 'vue';

export const TilePlaceholder = defineComponent({
    props: ['targetTile', 'isTarget'],
    methods: {
        onClick() {
            if ( ! this.isTarget) return;
            this.$emit('onSelect', this.targetTile);
        }
    },
    'template': `
    <div class="tile-placeholder">
        <div class="tile-placeholder-content" :class="{'tile-placeholder-content--target': isTarget}" v-on:click="onClick"></div>
    </div>
    `
});
