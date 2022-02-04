import { Form } from '../../common/form';
import './form.scss';

export const TextObj = {
  signInFormLegend: 'Вход',
  signUpFormLegend: 'Регистрация',
  signUpFormPasswordField: 'Пароль (8-12 знаков)',
  signUpFormNameField: 'Имя (3-12 знаков)',
  FormEmailField: 'Email: example@domen.com',
};

export abstract class AutorizationForm extends Form {
  public fieldset: HTMLFieldSetElement;

  public legend: HTMLLegendElement;

  constructor() {
    super({ class: 'form' });
    this.fieldset = document.createElement('fieldset');
    this.fieldset.classList.add('form__fieldset');
    this.legend = document.createElement('legend');
    this.legend.classList.add('form__caption');
    this.container.append(this.fieldset);
    this.fieldset.append(this.legend);
  }
}
