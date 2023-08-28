import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';

class DestinationsModel extends Observable {
  #destinationsApiService = null;
  #destinations = [];

  constructor({ destinationsApiService }) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }
}

export default DestinationsModel;
