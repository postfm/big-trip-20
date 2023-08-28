import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../utils/const.js';

const noPointTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};


function createNoPointViewTemplate({ filterType }) {
  const noPointTextValue = noPointTextType[filterType];
  return `<p class="trip-events__msg">${noPointTextValue}</p>
  `;
}

class NoPointView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointViewTemplate(this.#filterType);
  }

}

export default NoPointView;
