export let WordState = {
  PAGE: 0,
  GROUP: 0,
  BG: '#e9e91dc4',
  TOTALPAGES: 30,
  VOCABULARY: false,
  isStudiedPage: false,
};

export class RSLangSS {
  saveToSessionStorage() {
    window.sessionStorage.setItem('wordState', JSON.stringify(WordState));
  }

  private getFromSessionStorage(): string | null {
    return window.sessionStorage.getItem('wordState');
  }

  setWordStateFromStorage() {
    const data = this.getFromSessionStorage();
    if (data) {
      WordState = JSON.parse(data);
      console.log(WordState);
    }
  }
}

export const rsLangSS = new RSLangSS();
