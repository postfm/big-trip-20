import AbstractView from '../framework/view/abstract-view';

function newPointButtonViewTemplate() {
  return `<button
            class="trip-main__event-add-btn btn btn--big btn--yellow"
            type="button"
          >
            New event
          </button>`;
}

class NewPointButtonView extends AbstractView {

  #handleClickNewPointButton = null;

  constructor({ onNewPointButtonClick }) {
    super();
    this.#handleClickNewPointButton = onNewPointButtonClick;

    this.element.addEventListener('click', this.#clickNewPointButtonHandler);
  }

  get template() {
    return newPointButtonViewTemplate();
  }

  #clickNewPointButtonHandler = (evt) => {
    evt.preventDefault();
    this.#handleClickNewPointButton();
  };
}

export default NewPointButtonView;
