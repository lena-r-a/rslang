import { AutorizationForm } from '../AutorizationForm';
import { Form } from '../../../common/form';
import '../form.scss';
import { TextObj } from '../AutorizationForm';
import { Attr } from '../../../common/types';
import { IUserCreate, UserService } from '../../../services/UsersService';
import { PageIds } from '../../../app';
import { Preloader } from '../../../common/preloader';
import * as yup from 'yup';
// import { string } from 'yup/lib/locale';

const userSchema = yup.object().shape({
  name: yup.string().required('поле обязательное для заполнения').min(3, 'минимум 3 символа').max(8, 'максимум 8 символов'),
  email: yup.string().email('email должен содержать значок @').required('поле обязательное для заполнения'),
  password: yup.string().required('поле обязательное для заполнения').min(8, 'минимум 8 символов').max(12, 'максимум 12 символов'),
});

type UserType = yup.InferType<typeof userSchema>;

const inputNameSchema = yup.object().shape({
  name: yup.string().required('Поле обязательное для заполнения').min(3, 'Введите минимум 3 символа').max(8, 'Введите максимум 8 символов'),
});

type InputNameType = yup.InferType<typeof inputNameSchema>;

const inputEmailSchema = yup.object().shape({
  email: yup.string().email('Введите данные в формате example@domen.com').required('Поле обязательное для заполнения'),
});

type InputEmailType = yup.InferType<typeof inputEmailSchema>;

const inputPasswordSchema = yup.object().shape({
  password: yup.string().required('Поле обязательное для заполнения').min(8, 'Введите минимум 8 символов').max(12, 'Ведите максимум 12 символов'),
});

type InputPasswordType = yup.InferType<typeof inputPasswordSchema>;

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

    this.container.addEventListener('focusout', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('form__input')) {
        const err = this.checkValidElement(target);
        if (err) {
          target.classList.add('form__input--invalid');
          target.focus();
          this.showErrorMessage(err.errors[0]);
        } else {
          target.classList.remove('form__input--invalid');
        }
      }
    });

    this.container.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      //todo регестрируем, на каком элементе произошло событие, если на инпутах - как при focusout
      //todo если на кнопке - отправляем форму
      const params: IUserCreate = {
        name: this.inputName.value,
        email: this.inputEmail.value,
        password: this.inputPassword.value,
      };
      try {
        userSchema.validateSync(params, { abortEarly: false });
        // if (this.checkValidForm()) {
        // const params: IUserCreate = {
        //   name: this.inputName.value,
        //   email: this.inputEmail.value,
        //   password: this.inputPassword.value,
        // };
        Preloader.showPreloader();
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
      } catch (err) {
        const error = err as UserType;
        this.showErrorMessage(error.errors[0]);
      }
      // }
    });
  }

  private checkValidElement(el: HTMLElement): InputEmailType | InputNameType | InputPasswordType | undefined {
    switch (el) {
      case this.inputEmail:
        try {
          inputEmailSchema.validateSync({ email: this.inputEmail.value }, { abortEarly: false });
        } catch (err) {
          return err as InputEmailType;
        }
        break;
      case this.inputName:
        try {
          inputNameSchema.validateSync({ name: this.inputName.value });
        } catch (err) {
          return err as InputNameType;
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

  // private checkValidForm(): boolean {
  //   if (this.inputEmail.validity.valid && this.inputName.validity.valid && this.inputPassword.validity.valid) {
  //     return true;
  //   } else return false;
  // }

  public render() {
    this.legend.append(this.inputName);
    this.legend.append(this.inputEmail);
    this.legend.append(this.inputPassword);
    this.legend.append(this.signUpBtn);
    return this.container;
  }
}
