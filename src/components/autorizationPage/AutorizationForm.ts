import { Form } from '../../common/form';
import './form.scss';

export const TextObj = {
  signInFormLegend: 'Вход',
  signUpFormLegend: 'Регистрация',
  signUpFormPasswordField: 'Пароль (8-12 знаков)',
  signUpFormNameField: 'Имя (3-12 знаков)',
  signUpFormEmailField: 'Email: example@domen.com',
  signInFormPasswordField: 'Введите пароль',
  signInFormEmailField: 'Введите email',
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

  private getErrorMessage(message: string): HTMLElement {
    const messageContainer = document.querySelector('.aut__message') as HTMLElement;
    messageContainer.textContent = message;
    return messageContainer;
  }

  private getSuccessMessage(message: string): HTMLElement {
    const messageContainer = document.querySelector('.header__message') as HTMLElement;
    messageContainer.textContent = message;
    return messageContainer;
  }

  public showErrorMessage(messageText: string) {
    const message = this.getErrorMessage(messageText);
    message.style.visibility = 'visible';
    setTimeout(() => {
      message.style.visibility = 'hidden';
    }, 4000);
  }

  public showSuccesMessage(messageText: string) {
    const message = this.getSuccessMessage(messageText);
    message.style.opacity = '1';
    setTimeout(() => {
      message.style.opacity = '0';
    }, 4000);
  }

  public clearForm() {
    const form = this.container as HTMLFormElement;
    form.reset();
  }
}
