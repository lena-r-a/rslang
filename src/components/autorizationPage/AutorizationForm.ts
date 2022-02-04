import { Form } from '../../common/form';
import './form.scss';

export const TextObj = {
  signInFormLegend: 'Войти',
  signUpFormLegend: 'Зарегистрироваться',
};

export abstract class AutorizationForm extends Form {
  public fieldset: HTMLFieldSetElement;

  public legend: HTMLLegendElement;

  constructor() {
    super(['form']);
    this.fieldset = document.createElement('fieldset');
    this.fieldset.classList.add('form__fieldset');
    this.legend = document.createElement('legend');
    this.legend.classList.add('form__caption');
    this.container.append(this.fieldset);
    this.fieldset.append(this.legend);
  }
}
