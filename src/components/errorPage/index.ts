import { Page } from '../../core/templates/page';
import './errorPage.scss';

export class ErrorPage extends Page {
  private errorType: string;

  static TextObj: { [prop: string]: string } = {
    '404': 'Ошибка! Страница не найдена',
  };

  constructor(id: string, errorType: string) {
    super(id);
    this.errorType = errorType;
  }

  render() {
    const title = this.createHeaderTitle(ErrorPage.TextObj[this.errorType]);
    title.classList.add('errorMessage');
    this.container.append(title);
    return this.container;
  }
}
