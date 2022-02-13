import { App } from './app';
import { Statistics } from './states/statisticsState';
// import { refreshUserToken } from './states/logInData';
import './styles/main.scss';

const app = new App();
app.run();

// refreshUserToken();

const data = {
  newWords: 2,
  rightAnsw: 5,
  questions: 5,
  session: 5,
};

// Statistics.updateStat('challenge', data);
// Statistics.updateStat('learned', 7);
