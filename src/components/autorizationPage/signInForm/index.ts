import { AutorizationForm } from '../AutorizationForm';
import { Form } from '../../../common/form';
import '../form.scss';
import { TextObj } from '../AutorizationForm';
import { Attr } from '../../../common/types';
import { PageIds } from '../../../app';

const inputEmailAttr: Attr = {
  type: 'text',
  placeholder: TextObj.FormEmailField,
  required: '',
  autofocus: '',
};

const inputPasswordAttr: Attr = {
  type: 'password',
  placeholder: TextObj.signUpFormPasswordField,
  required: '',
};

export class SignInForm extends AutorizationForm {
  private inputEmail: HTMLInputElement;

  private inputPassword: HTMLInputElement;

  private signInBtn: HTMLButtonElement;

  private signUpBtn: HTMLLinkElement;

  private text: HTMLElement;

  constructor() {
    super();
    this.container.classList.add('form--signInForm');
    this.inputEmail = Form.renderInput(inputEmailAttr);
    this.inputEmail.focus();
    this.inputPassword = Form.renderInput(inputPasswordAttr);
    this.signInBtn = Form.renderButton(['form__btn', 'form__btn-signIn'], TextObj.signInFormLegend);
    this.signInBtn.setAttribute('type', 'submit');
    this.signUpBtn = Form.renderLink(['form__btn', 'form__btn--signUp'], TextObj.signUpFormLegend);
    this.signUpBtn.href = `#${PageIds.signUpPage}`;
    this.signUpBtn.textContent = TextObj.signUpFormLegend;
    this.inputEmail.classList.add('form__input', 'form__input--email');
    this.inputPassword.classList.add('form__input', 'form__input--password');
    this.signInBtn.classList.add('form__btn', 'form__btn--signIn');
    this.legend.textContent = TextObj.signInFormLegend;
    this.text = document.createElement('p');
    this.text.classList.add('form__text');
    this.text.textContent = 'Еще не зарегистрировался? Жми!';
  }

  public render() {
    this.legend.append(this.inputEmail);
    this.legend.append(this.inputPassword);
    this.legend.append(this.signInBtn);
    this.legend.append(this.text);
    this.legend.append(this.signUpBtn);
    return this.container;
  }
}
