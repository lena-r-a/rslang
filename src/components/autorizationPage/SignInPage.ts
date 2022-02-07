import { Page } from '../../core/templates/page';
import { SignInForm } from './signInForm';
import './autorizationPages.scss';

export class SignInPage extends Page {
  private form: SignInForm;

  private formWrapper: HTMLElement;

  private messageContainer: HTMLElement;

  static TextObject = {
    MainTitle: 'SignInPage',
  };

  constructor(id: string) {
    super(id);
    this.container.classList.add('aut');
    this.form = new SignInForm();
    this.formWrapper = document.createElement('div');
    this.formWrapper.classList.add('aut__wrapper');
    this.messageContainer = document.createElement('span');
    this.messageContainer.classList.add('aut__message');
  }

  render() {
    const title = this.createHeaderTitle(SignInPage.TextObject.MainTitle);
    title.classList.add('visually-hidden');
    this.container.append(title);
    this.container.append(this.messageContainer);
    this.formWrapper.append(this.form.render());
    this.container.append(this.formWrapper);
    return this.container;
  }
}
