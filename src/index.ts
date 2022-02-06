import { App } from './app';
import './styles/main.scss';

// private getPreloader() {
//   const preloader = new Preloader();
//   return preloader.render();
// }
const app = new App();

app.run();
