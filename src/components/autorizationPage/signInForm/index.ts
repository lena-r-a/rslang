import { AutorizationForm } from '../AutorizationForm';
import { Form } from '../../../common/form';
import '../form.scss';
import { TextObj } from '../AutorizationForm';
import { Attr } from '../../../common/types';
import { App, PageIds } from '../../../app';
import { IUserCreate, IUserLogin, UserService } from '../../../services/UsersService';
import { RSLangLS } from '../../../RSLangLS';
import { Preloader } from '../../../common/preloader';
import * as yup from 'yup';

const inputEmailAttr: Attr = {
  type: 'text',
  placeholder: TextObj.signInFormEmailField,
};

const inputPasswordAttr: Attr = {
  type: 'password',
  placeholder: TextObj.signInFormPasswordField,
};

const statusMessages: StatusMessagesType = {
  403: 'Нeправильно введен пароль или email. Попробуйте еще раз.',
  404: 'Пользователь не найден. Попробуйте еще раз.',
  default: 'Что-то пошло не так. Попробуйте еще раз.',
  success: 'Вы успешно вошли в аккаунт!',
};

type StatusMessagesType = {
  403: string;
  404: string;
  default: string;
  success: string;
};

const inputEmailSchema = yup.object().shape({
  email: yup.string().required('Поле обязательное для заполнения'),
});

export type InputEmailType = yup.InferType<typeof inputEmailSchema>;

const inputPasswordSchema = yup.object().shape({
  password: yup.string().required('Поле обязательное для заполнения'),
});

export type InputPasswordType = yup.InferType<typeof inputPasswordSchema>;

export class SignInForm extends AutorizationForm {
  private inputEmail: HTMLInputElement;

  private inputPassword: HTMLInputElement;

  private signInBtn: HTMLButtonElement;

  private signUpBtn: HTMLLinkElement;

  private text: HTMLElement;

  private inputsArray: HTMLInputElement[];

  constructor() {
    super();
    this.container.classList.add('form--signInForm');
    this.inputEmail = Form.renderInput(inputEmailAttr);
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
    this.inputsArray = [this.inputEmail, this.inputPassword];

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
            case this.inputEmail:
              this.inputPassword.focus();
              break;
            case this.inputPassword:
              this.inputEmail.focus();
          }
        }
      });
      if (success) {
        Preloader.showPreloader();
        const params: IUserCreate = {
          email: this.inputEmail.value,
          password: this.inputPassword.value,
        };
        await this.submitForm(params);
      }
    });
  }

  private async submitForm(params: IUserCreate) {
    const request = new UserService();
    const resp: Response = await request.loginUser(params);
    if (resp.status === 200) {
      const res: IUserLogin = await resp.json();
      RSLangLS.saveUserData(res);
      Preloader.hidePreloader();
      const app = new App();
      app.runToMainPage();
    } else if (Object.keys(statusMessages).includes(String(resp.status))) {
      Preloader.hidePreloader();
      this.clearForm();
      this.inputEmail.focus();
      const key = resp.status as keyof StatusMessagesType;
      this.showErrorMessage(statusMessages[key]);
    } else {
      Preloader.hidePreloader();
      this.clearForm();
      this.inputEmail.focus();
      this.showErrorMessage(statusMessages.default);
    }
  }

  private checkValidElement(el: HTMLElement): InputEmailType | InputPasswordType | undefined {
    switch (el) {
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

  private changeInputPasswordType(el: HTMLElement) {
    const inputPassword = document.querySelector('.form__input--password') as HTMLElement;
    inputPassword.getAttribute('type') === 'password' ? inputPassword.setAttribute('type', 'text') : inputPassword.setAttribute('type', 'password');
    el.classList.toggle('form__password-eye--open');
  }

  private renderInputPassword(): HTMLElement {
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('form__password-wrapper');
    inputWrapper.append(this.inputPassword);
    const passwordEye = document.createElement('span');
    passwordEye.classList.add('form__password-eye');
    inputWrapper.append(passwordEye);
    passwordEye.addEventListener('click', (e: Event) => {
      const targetEl = e.currentTarget as HTMLElement;
      this.changeInputPasswordType(targetEl);
    });
    return inputWrapper;
  }

  public render() {
    this.legend.append(this.inputEmail);
    const inputPasswordWrapper = this.renderInputPassword();
    this.legend.append(inputPasswordWrapper);
    this.legend.append(this.signInBtn);
    this.legend.append(this.text);
    this.legend.append(this.signUpBtn);
    return this.container;
  }
}
