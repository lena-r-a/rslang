import { Component } from '../../core/templates/components';
import './footer.scss';
import { TeamMemberData } from '../../components/mainPage/team/teamMember/types';
import { teamMembersData } from '../../components/mainPage/team';

export class Footer extends Component {
  constructor() {
    super('div', ['footer']);
    this.container.innerHTML =
      '<div class="footer__date footer__col"><p>&copy; 2022</p></div><div class="footer__rss footer__col"><a href="https://rs.school/js/" target="_blank" aria-label="Rolling scopes school"><img src="https://rs.school/images/rs_school_js.svg" alt="Rolling scopes school"></a></div><div class="footer__students footer__col"></div>';
  }

  private getLink(dataObj: TeamMemberData) {
    const link = document.createElement('a');
    link.classList.add('footer__link');
    link.setAttribute('target', '_blank');
    link.href = dataObj.gitHub;
    link.textContent = dataObj.nicName;
    return link;
  }

  private renderGitHubLinks() {
    const links = document.createElement('div');
    links.classList.add('footer__links-wrapper');
    teamMembersData.forEach((el) => {
      const link = this.getLink(el);
      links.append(link);
    });
    return links;
  }

  render() {
    const linksCol = this.container.querySelector('.footer__students');
    linksCol?.append(this.renderGitHubLinks());
    return this.container;
  }
}
