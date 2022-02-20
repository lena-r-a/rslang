import { WordState } from '../../RSLangSS';

// https://codepen.io/codenameyesse/pen/PopEByQ

export function createPagination(totalPages: number, page: number, element: HTMLElement) {
  let liTag = '';
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (page > 1) {
    //show the next button if the page value is greater than 1
    liTag += '<li class="btn prev"><span class="prev"><i class="fas fa-angle-left"></i> Prev</span></li>';
  }

  if (page > 2) {
    //if page value is less than 2 then add 1 after the previous button
    liTag += '<li class="first numb"><span class="numb-span">1</span></li>';
    if (page > 3) {
      //if page value is greater than 3 then add this (...) after the first li or page
      liTag += '<li class="dots"><span>...</span></li>';
    }
  }

  // how many pages or li show before the current li
  if (page == totalPages) {
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }
  // how many pages or li show after the current li
  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage = afterPage + 1;
  }

  for (let plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) {
      //if plength is greater than totalPage length then continue
      continue;
    }
    if (plength == 0) {
      //if plength is 0 than add +1 in plength value
      plength = plength + 1;
    }
    if (page == plength) {
      //if page is equal to plength than assign active string in the active variable
      active = 'active';
    } else {
      //else leave empty to the active variable
      active = '';
    }
    liTag += `<li class="numb${active ? ' ' + active : ''}"><span class="numb-span">${plength}</span></li>`;
  }

  if (page < totalPages - 1) {
    //if page value is less than totalPage value by -1 then show the last li or page
    if (page < totalPages - 2) {
      //if page value is less than totalPage value by -2 then add this (...) before the last li or page
      liTag += '<li class="dots"><span class="numb-span">...</span></li>';
    }
    liTag += `<li class="last numb"><span class="numb-span">${totalPages}</span></li>`;
  }

  if (page < totalPages) {
    //show the next button if the page value is less than totalPage(20)
    liTag += '<li class="btn next"><span class="next">Next <i class="fas fa-angle-right"></i></span></li>';
  }
  element.innerHTML = liTag; //add li tag inside ul tag
  return liTag; //reurn the li tag
}

export function toggleStylesForStudiedPage() {
  const container = document.querySelector('.elbook__words-container') as HTMLElement;
  if (WordState.isStudiedPage && !WordState.VOCABULARY) {
    document.querySelector('.active')?.classList.add('studied-page');
    container.style.border = '2px solid green';
    document.querySelectorAll('.game-button').forEach((el) => {
      const elem = el as HTMLElement;
      elem.style.pointerEvents = 'none';
    });
  } else {
    document.querySelector('.page-navigation__current')?.classList.remove('studied-page');
    container.style.border = 'none';
    document.querySelectorAll('.game-button').forEach((el) => {
      const elem = el as HTMLElement;
      elem.style.pointerEvents = 'auto';
    });
  }
}
