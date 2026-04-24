import { mount } from 'svelte';
import './index.css';

import App from './App.svelte';
import { initializePlatform } from './constants/platform';

const init = async (): Promise<void> => {
  await initializePlatform();

  mount(App, {
    target: document.getElementById('app')!
  });
};

init();
