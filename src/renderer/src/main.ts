import { mount } from 'svelte';
import './index.css';

import App from './App.svelte';
import { initPlatform } from './constants/platform';

const init = async (): Promise<void> => {
  await initPlatform();
  mount(App, {
    target: document.getElementById('app')!
  });
};

init();
