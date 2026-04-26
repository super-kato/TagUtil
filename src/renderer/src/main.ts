import { mount } from 'svelte';
import './index.css';

import App from './App.svelte';
import { initializeGlobalErrorHandler } from './infrastructure/error-handler';
import { initializePlatform } from './infrastructure/adapters/platform-adapter';

const init = async (): Promise<void> => {
  initializeGlobalErrorHandler();
  await initializePlatform();

  mount(App, {
    target: document.getElementById('app')!
  });
};

init();
