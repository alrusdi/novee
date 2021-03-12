import { defineComponent } from 'vue';
import { NavigationMixing } from '../mixins/NavigationMixin';

export const Button = defineComponent({
    props: ['color', 'isDisabled', 'onClick', 'link', 'page', 'type'],
    mixins: [
        NavigationMixing
    ],
    methods: {
        getCssClass() {
            const classes = ['button'];
            if (this.type) {
                const parts = this.type.split(' ');
                classes[0] = 'button-' + parts[0];
                classes.push(classes[0] + '--' + parts[1]);
            }

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
            if (this.page) {
                return this.goto(this.page);
            }
            if (this.link) {
                window.location.href = this.link;
            }
        }
    },
    'template': `
    <a :href="link || '#'" :class="getCssClass()" v-on:click.prevent="handleClick()">
        <div class="button-label"><slot></slot></div>
    </a>
    `
});
