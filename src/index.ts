import { App } from './app';
import './styles/main.scss';
import { Preloader } from './common/preloader';

// document.addEventListener('readystatechange', () => {
//   if (document.readyState == 'interactive') {
//     Preloader.showPreloader();
//   }
//   if (document.readyState === 'complete') {
//     Preloader.hidePreloader();
//   }
// });
Preloader.enablePreloader();
const app = new App();
app.run();
