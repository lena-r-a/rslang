import { Page } from '../../core/templates/page';
import { SignInForm } from './signInForm';
import './autorizationPage.scss';

export class SignInPage extends Page {
  private form: SignInForm;

  private formWrapper: HTMLElement;

  static TextObject = {
    MainTitle: 'SignInPage',
  };

  constructor(id: string) {
    super(id);
    this.container.classList.add('aut');
    this.form = new SignInForm();
    this.formWrapper = document.createElement('div');
    this.formWrapper.classList.add('aut__wrapper');
  }

  render() {
    const title = this.createHeaderTitle(SignInPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.formWrapper.append(this.form.render());
    this.container.append(this.formWrapper);
    return this.container;
  }
}
