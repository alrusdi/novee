import { defineComponent } from "vue";

export const Root = defineComponent({
    data() {
      return {
        screen: 'initial'
      }
    },
    'template': `
      <div :class="'container ' + 'topmost-'+screen">
        Hello novee!
      </div>
    `
})