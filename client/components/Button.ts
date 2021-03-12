import { defineComponent } from 'vue';

export const Button = defineComponent({
    props: ['color', 'isDisabled', 'onClick', 'link'],
    methods: {
        getCssClass() {
            const classes = ['button'];
            if (this.isDisabled) {
                classes.push('button--disabled');
            } else {
                classes.push('button--' + this.color);
            }
            return classes.join(' ');
        },
        handleClick() {
            if (this.onClick) {
                return this.onClick();
            }
            if (this.link) {
                window.location.href = this.link;
            }
        }
    },
    'template': `
    <a :href="link || '#'" :class="getCssClass()" v-on:click.prevent="handleClick()">
        <div class="button-label"><slot>Ok</slot></div>
    </a>
    `
});