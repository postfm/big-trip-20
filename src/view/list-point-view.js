import AbstractView from '../framework/view/abstract-view.js';

function createListPointView() {
  return '<ul class="trip-events__list"></ul>';
}

class ListPointView extends AbstractView {
  get template() {
    return createListPointView();
  }
}

export default ListPointView;
