import Observable from '../framework/observable.js';
import { FilterType } from '../utils/const.js';

class FiltersModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}

export default FiltersModel;
