import { mount } from 'svelte';
import './index.css';

import App from './App.svelte';
import { initializeGlobalErrorHandler } from './utils/error-handler';
import { initializePlatform } from './constants/platform';

const init = async (): Promise<void> => {
  initializeGlobalErrorHandler();
  await initializePlatform();

  mount(App, {
    target: document.getElementById('app')!
  });
};

init();
