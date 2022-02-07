import { AutorizationForm } from '../AutorizationForm';
import { Form } from '../../../common/form';
import '../form.scss';
import { TextObj } from '../AutorizationForm';
import { Attr } from '../../../common/types';
import { IUserCreate, UserService } from '../../../services/UsersService';
import { PageIds } from '../../../app';
import { Preloader } from '../../../common/preloader';
// import { SignUpPage } from '../SignUpPage';

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

const createUserErrorsMessages = {
  417: 'Извините, такой пользователь уже существует. Попробуйте еще раз',
  default: 'Что-то пошло не так. Попробуйте еще раз',
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
      Preloader.showPreloader();
      if (this.checkValidForm()) {
        const params: IUserCreate = {
          name: this.inputName.value,
          email: this.inputEmail.value,
          password: this.inputPassword.value,
        };
        const request = new UserService();
        const resp = await request.createUser(params);
        Preloader.hidePreloader();
        if (resp.status === 200) {
          window.location.hash = `#${PageIds.autorizationPage}`;
        } else if (resp.status === 417) {
          this.showMessage(createUserErrorsMessages[417]);
          this.clearForm();
          this.inputName.focus();
        } else {
          this.showMessage(createUserErrorsMessages.default);
          this.clearForm();
          this.inputName.focus();
        }
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
