import { AutorizationForm, inputEmailSchema, InputEmailType, InputNameType, inputPasswordSchema, InputPasswordType } from '../AutorizationForm';
import { Form } from '../../../common/form';
import '../form.scss';
import { TextObj } from '../AutorizationForm';
import { Attr } from '../../../common/types';
import { IUserCreate, UserService } from '../../../services/UsersService';
import { PageIds } from '../../../app';
import { Preloader } from '../../../common/preloader';
import * as yup from 'yup';

const inputNameSchema = yup.object().shape({
  name: yup.string().required('Поле обязательное для заполнения').min(3, 'Введите минимум 3 символа').max(8, 'Введите максимум 8 символов'),
});

const inputEmailAttr: Attr = {
  type: 'text',
  placeholder: TextObj.signUpFormEmailField,
  // pattern: '^([a-z0-9_-]{3,15})@([a-z]{1,}).([a-z]{2,})$',
  // required: '',
};

const inputNameAttr: Attr = {
  type: 'text',
  placeholder: TextObj.signUpFormNameField,
  // pattern: '^[A-Za-zА-Яа-яЁё ]{3,12}$',
  // required: '',
};

const inputPasswordAttr: Attr = {
  type: 'password',
  placeholder: TextObj.signUpFormPasswordField,
  // pattern: '[a-z0-9_-]{8,12}',
  // required: '',
};

const statusMessages = {
  417: 'Извините, такой пользователь уже существует. Попробуйте еще раз.',
  default: 'Что-то пошло не так. Попробуйте еще раз.',
  success: 'Вы успешно зарегистрированы! Выполните вход.',
};

export class SignUpForm extends AutorizationForm {
  private inputEmail: HTMLInputElement;

  private inputPassword: HTMLInputElement;

  private inputName: HTMLInputElement;

  private signUpBtn: HTMLButtonElement;

  private inputsArray: HTMLInputElement[];

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
    this.inputsArray = [this.inputName, this.inputEmail, this.inputPassword];

    this.inputsArray.forEach((el) => {
      el.addEventListener('blur', () => {
        const err = this.checkValidElement(el);
        if (err) {
          el.classList.add('form__input--invalid');
          el.focus();
          this.showErrorMessage(err.errors[0]);
        } else {
          el.classList.remove('form__input--invalid');
        }
      });
    });

    this.container.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      let success = true;
      this.inputsArray.forEach((el) => {
        const error = this.checkValidElement(el);
        if (error) {
          el.classList.add('form__input--invalid');
          success = false;
          return;
        } else {
          el.classList.remove('form__input--invalid');
          switch (el) {
            case this.inputName:
              this.inputEmail.focus();
              break;
            case this.inputEmail:
              this.inputPassword.focus();
          }
        }
      });
      if (success) {
        const params: IUserCreate = {
          name: this.inputName.value,
          email: this.inputEmail.value,
          password: this.inputPassword.value,
        };
        Preloader.showPreloader();
        await this.submitForm(params);
      }
    });
  }

  private async submitForm(params: IUserCreate) {
    const request = new UserService();
    const resp = await request.createUser(params);
    Preloader.hidePreloader();
    if (resp.status === 200) {
      window.location.hash = `#${PageIds.autorizationPage}`;
      this.showSuccesMessage(statusMessages.success);
    } else if (resp.status === 417) {
      this.showErrorMessage(statusMessages[417]);
      this.clearForm();
      this.inputName.focus();
    } else {
      this.showErrorMessage(statusMessages.default);
      this.clearForm();
      this.inputName.focus();
    }
  }

  private checkValidElement(el: HTMLElement): InputEmailType | InputNameType | InputPasswordType | undefined {
    switch (el) {
      case this.inputName:
        try {
          inputNameSchema.validateSync({ name: this.inputName.value }, { abortEarly: false });
        } catch (err) {
          return err as InputNameType;
        }
        break;
      case this.inputEmail:
        try {
          inputEmailSchema.validateSync({ email: this.inputEmail.value }, { abortEarly: false });
        } catch (err) {
          return err as InputEmailType;
        }
        break;
      case this.inputPassword:
        try {
          inputPasswordSchema.validateSync({ password: this.inputPassword.value }, { abortEarly: false });
        } catch (err) {
          return err as InputPasswordType;
        }
    }
  }

  public render() {
    this.legend.append(this.inputName);
    this.legend.append(this.inputEmail);
    this.legend.append(this.inputPassword);
    this.legend.append(this.signUpBtn);
    return this.container;
  }
}
