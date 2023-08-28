import { RenderPosition, render, remove } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripInfoMainView from '../view/trip-info-main-view.js';
import TripInfoCostView from '../view/trip-info-cost-view.js';
import AbstractView from '../framework/view/abstract-view.js';
import FilterPresenter from './filter-presenter.js';
import { sortPointByDay } from '../utils/points.js';
import { filter } from '../utils/filter.js';

class HeaderPresenter extends AbstractView {
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filtersPresenter = null;
  #tripInfoMainComponent = null;
  #tripInfoCostComponent = null;
  #tripInfoComponent = null;
  #filtersModel = null;
  #tripHeaderContainer = null;
  #filtersContainer = null;
  #filterType = null;

  constructor({
    tripHeaderContainer,
    filtersContainer,
    pointsModel,
    destinationsModel,
    offersModel,
    filtersModel,
  }) {
    super();
    this.#tripHeaderContainer = tripHeaderContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filtersModel = filtersModel;

    this.#tripInfoComponent = new TripInfoView();
    this.#filtersPresenter = new FilterPresenter({
      filtersContainer: this.#filtersContainer,
      filtersModel: this.#filtersModel,
      pointsModel: this.#pointsModel,
    });

    this.#pointsModel.addObserver(this.#handleModeEvent);
    this.#filtersModel.addObserver(this.#handleModeEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    return sortPointByDay(filteredPoints);
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }


  init() {
    if (!this.points.length) {
      this.#filtersPresenter.init();
      return;
    }

    this.#filtersPresenter.init();
  }


  #renderTripInfo() {
    render(this.#tripInfoComponent, this.#tripHeaderContainer, RenderPosition.AFTERBEGIN);
  }

  #renderTripInfoMain() {
    this.#tripInfoMainComponent = new TripInfoMainView({
      points: this.points,
      destinations: this.destinations,
    });
    render(this.#tripInfoMainComponent, this.#tripInfoComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderTripInfoCost() {
    this.#tripInfoCostComponent = new TripInfoCostView({
      points: this.points,
      offers: this.offers
    });
    render(this.#tripInfoCostComponent, this.#tripInfoComponent.element);
  }


  #handleModeEvent = () => {
    if (!this.points.length) {
      remove(this.#tripInfoComponent);
      return;
    }
    this.#renderTripInfo();
    remove(this.#tripInfoMainComponent);
    this.#renderTripInfoMain();
    remove(this.#tripInfoCostComponent);
    this.#renderTripInfoCost();
  };
}

export default HeaderPresenter;
