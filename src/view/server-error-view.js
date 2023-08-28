import AbstractView from '../framework/view/abstract-view';


function createServerErrorViewTemplate() {
  return `<p class="trip-events__msg">Header Authorization is not correct.</p>
  `;
}

class NoPointView extends AbstractView {

  get template() {
    return createServerErrorViewTemplate();
  }

}

export default NoPointView;
