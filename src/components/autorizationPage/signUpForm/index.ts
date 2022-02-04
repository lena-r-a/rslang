import { AutorizationForm } from '../AutorizationForm';
import { Form } from '../../../common/form';
import '../form.scss';
import { TextObj } from '../AutorizationForm';
import type { Attr } from '../../../common/input';

const inputEmailAttr: Attr = {
  type: 'text',
  placeholder: TextObj.FormEmailField,
  pattern: '^([a-z0-9_-]{3,15})@([a-z]{4,}).([a-z]{2,})$',
  required: '',
};

const inputNameAttr: Attr = {
  type: 'text',
  placeholder: TextObj.signUpFormNameField,
  pattern: '^[A-Za-zА-Яа-яЁё ]{3,12}$',
  required: '',
  autofocus: '',
};

const inputPasswordAttr: Attr = {
  type: 'password',
  placeholder: TextObj.signUpFormPasswordField,
  pattern: '[a-z0-9_-]{8,12}',
  required: '',
};


export class SignUpForm extends AutorizationForm {
  private inputEmail: HTMLInputElement;

  private inputPassword: HTMLInputElement;

  private inputName: HTMLInputElement;

  private signInBtn: HTMLInputElement;

  private signUpBtn: HTMLInputElement;

  constructor() {
    super();
    this.container.classList.add('form--signUpForm');
    this.inputEmail = Form.renderInput(inputEmailAttr);
    this.inputName = Form.renderInput(inputNameAttr);
    this.inputName.focus();
    this.inputPassword = Form.renderInput(inputPasswordAttr);
    this.signInBtn = Form.renderInput({ type: 'submit' });
    this.signInBtn.value = TextObj.signInFormLegend;
    this.signUpBtn = Form.renderInput({ type: 'submit' });
    this.signUpBtn.value = TextObj.signUpFormLegend;
    this.inputEmail.classList.add('form__input', 'form__input--email');
    this.inputName.classList.add('form__input', 'form__input--name');
    this.inputPassword.classList.add('form__input', 'form__input--password');
    this.signInBtn.classList.add('form__btn', 'form__btn--signIn');
    this.signUpBtn.classList.add('form__btn', 'form__btn--signUp');
    this.legend.textContent = TextObj.signUpFormLegend;
  }

  public render() {
    this.legend.append(this.inputName);
    this.legend.append(this.inputEmail);
    this.legend.append(this.inputPassword);
    this.legend.append(this.signInBtn);
    this.legend.append(this.signUpBtn);
    return this.container;
  }
}
