import { createApp } from 'vue';
import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader
import { aliases, mdi } from 'vuetify/iconsets/mdi';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'SPdark',
    themes: {
      SPdark: {
        dark: true,
        colors: {
          primary: '#004D40',
          'primary-light': '#4DB6AC',
          'rank-1': '#c5c5c5',
          'rank-2': '#fff',
          'rank-3': '#46efbc',
          'rank-4': '#33c9da',
          'rank-5': '#f6c60f',
          'rank-6': '#e88c1a',
          'rare-1': '#a6a6a6',
          'rare-2': '#e0ea38',
          'rare-3': '#04b5fd',
          'rare-4': '#7a69b4',
          'rare-5': '#ffd500',
          'rare-6': '#cd4527',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

createApp(App).use(vuetify).mount('#app');
