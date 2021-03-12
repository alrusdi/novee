import { defineComponent } from 'vue';
import { NavigationMixing } from '../mixins/NavigationMixin';

export const TopMenu = defineComponent({
    mixins: [
      NavigationMixing
    ],
    'template': `
    <div class="top-navigation">
      <div class="navigation-items">
          <a href="/" class="navigation-item navigation-item--home" title="Main menu"></a>
          <a href="/logout" class="navigation-item navigation-item--logout" title="Logout"></a>
      </div>
    </div>
    `
});
