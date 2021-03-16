
import { createApp } from 'vue';
import { Root } from './components/Root';

const app = createApp(Root);

app.directive('trim-whitespace', {
        beforeMount(el) {
            for (const node of el.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.data.trim() === '') {
                    node.remove();
                }
        }
    }
});

app.mount('#app');
