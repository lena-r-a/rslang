import { Page } from '../../core/templates/page';
import { SignUpForm } from './signUpForm';
import './autorizationPages.scss';

export class SignUpPage extends Page {
  private form: SignUpForm;

  private formWrapper: HTMLElement;

  static TextObject = {
    MainTitle: 'SignUpPage',
  };

  constructor(id: string) {
    super(id);
    this.container.classList.add('aut');
    this.form = new SignUpForm();
    this.formWrapper = document.createElement('div');
    this.formWrapper.classList.add('aut__wrapper');
  }

  render() {
    const title = this.createHeaderTitle(SignUpPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.formWrapper.append(this.form.render());
    this.container.append(this.formWrapper);
    return this.container;
  }
}
