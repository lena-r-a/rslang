import { AutorizationForm } from '../AutorizationForm';
import { Form } from '../../../common/form';
import '../form.scss';
import { TextObj } from '../AutorizationForm';
import { Attr } from '../../../common/types';
import { IUserCreate, UserService } from '../../../services/UsersService';
import { PageIds } from '../../../app';

const inputEmailAttr: Attr = {
  type: 'text',
  placeholder: TextObj.FormEmailField,
  pattern: '^([a-z0-9_-]{3,15})@([a-z]{1,}).([a-z]{2,})$',
  required: '',
};

const inputNameAttr: Attr = {
  type: 'text',
  placeholder: TextObj.signUpFormNameField,
  pattern: '^[A-Za-zА-Яа-яЁё ]{3,12}$',
  required: '',
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

  private signUpBtn: HTMLButtonElement;

  constructor() {
    super();
    this.container as HTMLFormElement;
    this.container.classList.add('form--signUpForm');
    this.inputEmail = Form.renderInput(inputEmailAttr);
    this.inputName = Form.renderInput(inputNameAttr);
    this.inputName.focus();
    this.inputPassword = Form.renderInput(inputPasswordAttr);
    this.signUpBtn = Form.renderButton(['form__btn', 'form__btn--signUp'], TextObj.signUpFormLegend);
    this.inputEmail.classList.add('form__input', 'form__input--email');
    this.inputName.classList.add('form__input', 'form__input--name');
    this.inputPassword.classList.add('form__input', 'form__input--password');
    this.signUpBtn.classList.add('form__btn', 'form__btn--signUp');
    this.legend.textContent = TextObj.signUpFormLegend;
    this.container.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      if (this.checkValidForm()) {
        const params: IUserCreate = {
          name: this.inputName.value,
          email: this.inputEmail.value,
          password: this.inputPassword.value,
        };
        const request = new UserService();
        const resp = await request.createUser(params);
        //todo получаем здесь сырой ответ и обрабатываем ошибки
        console.log(resp);
        window.location.hash = `#${PageIds.autorizationPage}`;
      }
    });
  }

  private checkValidForm(): boolean {
    if (this.inputEmail.validity.valid && this.inputName.validity.valid && this.inputPassword.validity.valid) {
      return true;
    } else return false;
  }

  public render() {
    this.legend.append(this.inputName);
    this.legend.append(this.inputEmail);
    this.legend.append(this.inputPassword);
    this.legend.append(this.signUpBtn);
    return this.container;
  }
}
