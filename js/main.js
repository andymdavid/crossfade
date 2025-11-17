import { initAnimations } from './animations.js';
import { initNavigation } from './navigation.js';

window.addEventListener('DOMContentLoaded', () => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
  initNavigation();
  initAnimations();
});
