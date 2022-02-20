export let WordState: WordStateType = {
  PAGE: 0,
  GROUP: 0,
  BG: '#e9e91dc4',
  TOTALPAGES: 30,
  VOCABULARY: false,
  isStudiedPage: false,
  isFromBookPage: false,
};

export type WordStateType = {
  PAGE: number;
  GROUP: number;
  BG: string;
  TOTALPAGES: number;
  VOCABULARY: boolean;
  isStudiedPage: boolean;
  isFromBookPage: boolean;
};

export class RSLangSS {
  saveToSessionStorage() {
    window.sessionStorage.setItem('wordState', JSON.stringify(WordState));
  }

  public getFromSessionStorage(): string | null {
    return window.sessionStorage.getItem('wordState');
  }

  setWordStateFromStorage() {
    const data = this.getFromSessionStorage();
    if (data) {
      WordState = JSON.parse(data);
    }
  }

  public getWordStateFromSessionStorage(): WordStateType | undefined {
    const state: string | null = this.getFromSessionStorage();
    if (state) {
      return JSON.parse(state);
    }
  }
}

export const rsLangSS = new RSLangSS();
