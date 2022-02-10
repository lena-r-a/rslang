import { Page } from '../../core/templates/page';
import { SignUpForm } from './signUpForm';
import './autorizationPages.scss';

export class SignUpPage extends Page {
  private form: SignUpForm;

  private formWrapper: HTMLElement;

  private messageContainer: HTMLElement;

  static TextObject = {
    MainTitle: 'SignUpPage',
  };

  constructor(id: string) {
    super(id);
    this.container.classList.add('aut');
    this.form = new SignUpForm();
    this.formWrapper = document.createElement('div');
    this.formWrapper.classList.add('aut__wrapper');
    this.messageContainer = document.createElement('span');
    this.messageContainer.classList.add('aut__message');
  }

  render() {
    const title = this.createHeaderTitle(SignUpPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.container.append(this.messageContainer);
    this.formWrapper.append(this.form.render());
    this.container.append(this.formWrapper);
    return this.container;
  }
}
