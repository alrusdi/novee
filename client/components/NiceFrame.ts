import { defineComponent } from 'vue';

export const NiceFrame = defineComponent({
    props: ['title'],
    template: `
        <div class="nice-frame">
            <div class="nice-frame-wrapper">
                <title class="nice-frame-title">{{ title }}</title>
                <div class="nice-frame-content">
                    <slot></slot>
                </div>
            </div>
            <div class="nice-frame-bottom"></div>
        </div>
    `
});