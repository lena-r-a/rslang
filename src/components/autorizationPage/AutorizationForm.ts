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

  public getMessage(message: string): HTMLElement {
    const messageContainer = document.querySelector('.aut__message') as HTMLElement;
    messageContainer.textContent = message;
    return messageContainer;
  }

  public showMessage(messageText: string) {
    const message = this.getMessage(messageText);
    setTimeout(() => {
      message.textContent = '';
    }, 5000);
  }

  public clearForm() {
    const form = this.container as HTMLFormElement;
    form.reset();
  }
}
