import { defineComponent } from 'vue';
import { Button } from './Button';


export const MainMenu = defineComponent({
    components: {
      Button
    },
    'template': `
      <div class="main-menu">
        <label class="main-menu-title">Novee</label>
        <div class="menu-items">
          <Button page="start-solo">Solo</Button>
          <Button page="make-invite">Multiplayer</Button>
          <Button page="rules">Rules</Button>
          <Button link="/logout" color="red">Logout</Button>
        </div>
        <div class="menu-footer">
          <Button type="square github" link="https://github.com/alrusdi/novee" />
          <Button type="square settings" page="settings" />
        </div>
      </div>
    `
});
