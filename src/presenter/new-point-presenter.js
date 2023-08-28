import EditPointFormView from '../view/edit-point-form-view';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UpdateType, UserAction } from '../utils/const.js';
import dayjs from 'dayjs';

class NewPointPresenter {
  #listPointContainer = null;
  #point = null;
  #destinations = null;
  #offers = null;
  #newPointFormComponent = null;
  #handleDataChange = null;
  #handleNewPointEditClose = null;


  constructor({ listPointContainer,
    point, destinations, offers, onDataChange, onNewPointEditClose }) {
    this.#listPointContainer = listPointContainer;
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleNewPointEditClose = onNewPointEditClose;

    this.#newPointFormComponent = new EditPointFormView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onFormClose: this.#handleFormClose,
    });
    render(this.#newPointFormComponent, this.#listPointContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    remove(this.#newPointFormComponent);
  }

  setSaving() {
    this.#newPointFormComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#newPointFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newPointFormComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    if (!point.destination
      || !point.dateFrom
      || !point.dateTo
      || !point.basePrice
      || dayjs(point.dateTo) < dayjs(point.dateFrom)) {
      this.#newPointFormComponent.shake();
      return;
    }
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point);

    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleNewPointEditClose();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#newPointFormComponent.reset(this.#point);

      remove(this.#newPointFormComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#handleNewPointEditClose();
    }
  };

  #handleFormClose = () => {
    this.#newPointFormComponent.reset(this.#point);
    this.#handleNewPointEditClose();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

}

export default NewPointPresenter;
