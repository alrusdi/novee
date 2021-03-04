import { defineComponent } from 'vue';
import { MainMenu } from './MainMenu';
import { MakeInvite } from './MakeInvite';
import { NavigationMixing } from '../mixins/NavigationMixin';

export const Root = defineComponent({
  data() {
    return {
      screen: 'main-menu'
    }
  },
  components: {
    MainMenu,
    MakeInvite
  },
  mixins: [
    NavigationMixing
  ],
  mounted() {
    const url = window.location.href;
    if (url.includes('/invite/')) {
        this.goto('make-invite');
    }
  },
  'template': `
    <div :class="'container ' + 'topmost-'+screen">
      <div class="top-navigation">
        <ul class="navigation-items">
          <li class="navigation-item">
            <a href="/">Main menu</a>
          </li>
          <li class="navigation-item navigation-item--logout">
            <a href="/logout">Logout</a>
          </li>
        </ul>
      </div>
      <template v-if="screen==='main-menu'">
        <MainMenu />
      </template>
      <template v-if="screen==='make-invite'">
        <MakeInvite />
      </template>
    </div>
  `
})