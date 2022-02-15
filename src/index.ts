import { App } from './app';
import { StatDataGameType } from './services/StatisticsService';
import { Statistics, StatDateLearnedType } from './states/statisticsState';
import { refreshUserToken } from './states/logInData';
import './styles/main.scss';

const app = new App();
app.run();

refreshUserToken();

// async function setStat() {
//   const data: StatDataGameType = {
//     newWords: 2,
//     rightAnsw: 5,
//     questions: 7,
//     session: 5,
//   };
//   const learned: StatDateLearnedType = {
//     word: 'bug',
//     add: true,
//   };

//   await Statistics.updateStat('challenge', data);
//   await Statistics.updateStat('sprint', data);
//   await Statistics.updateStat('learned', learned);
// }

// setStat();
