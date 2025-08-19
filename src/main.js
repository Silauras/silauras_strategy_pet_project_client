import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';

import ru from './locales/ru.json';
import en from './locales/en.json';
import uk from './locales/uk.json';
import de from './locales/de.json';

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: { ru, en, uk, de }
});

createApp(App)
    .use(i18n)
    .mount('#app');
