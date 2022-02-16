// после успешной регистрации usera получаем с бэк все слова statWords (WordService, getWords()). проходим по всем словам и для каждого слова создаем wordData
// при изменении данных - поправляем данные по слову на сервере.
// в дальнейшем при работе - используем не words, a usersWords (см swagger)

export let wordData: WordDataType = {
  difficulty: false,
  optional: {
    group: 0,
    page: 0,
    new: false,
    learned: false,
    rigthAnswers: 0,
  },
};

export type WordDataType = {
  difficulty: boolean; // сложное или нет
  optional: WordDataOptionalType;
};

export type WordDataOptionalType = {
  group: number; // номер группы
  page: number; // номер страницы
  new: boolean; // новое или нет
  learned: boolean; // изученное или нет
  rigthAnswers: number; // количество 
};
