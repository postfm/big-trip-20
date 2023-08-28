import { render, RenderPosition, remove } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListPointView from '../view/list-point-view.js';
import NoPointView from '../view/no-point-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import LoadingView from '../view/loading-view.js';
import ServerErrorView from '../view/server-error-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortPointByTime, sortPointByPrice, sortPointByDay, } from '../utils/points.js';
import { SortType, UpdateType, UserAction, FilterType, EMPTY_POINT } from '../utils/const.js';
import { filter } from '../utils/filter.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

class PagePresenter {
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filtersModel = null;
  #tripEventsContainer = null;
  #tripHeaderContainer = null;

  #sortPointComponent = null;
  #listPointComponent = new ListPointView();
  #noPointComponent = null;
  #newPointButtonComponent = null;
  #loadingComponent = new LoadingView();
  #serverErrorComponent = null;

  #pointPresenters = new Map();
  #pointPresenter = null;
  #newPointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #isNewPoint = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({
    tripEventsContainer,
    tripHeaderContainer,
    pointsModel,
    destinationsModel,
    offersModel,
    filtersModel,
  }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripHeaderContainer = tripHeaderContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filtersModel = filtersModel;

    this.#newPointButtonComponent = new NewPointButtonView({
      onNewPointButtonClick: this.#handleNewPointButtonClick
    });

    render(this.#newPointButtonComponent, this.#tripHeaderContainer);


    this.#pointsModel.addObserver(this.#handleModeEvent);
    this.#filtersModel.addObserver(this.#handleModeEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return sortPointByTime(filteredPoints);
      case SortType.PRICE:
        return sortPointByPrice(filteredPoints);
      case SortType.DEFAULT:
        return sortPointByDay(filteredPoints);
    }
    return filteredPoints;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  init() {
    this.#renderListPoint();
  }

  #renderListPoint() {
    this.#renderListPointComponent(this.#listPointComponent, this.#tripEventsContainer);

    if (this.#isLoading) {
      this.#renderLoadingComponent();
      return;
    }

    if (!this.points.length && !this.#isNewPoint) {
      this.#renderNoPointComponent();
      return;
    }

    this.#renderSort();

    this.points.forEach((point) =>
      this.#renderPoint(point,
        this.destinations,
        this.offers));
  }

  #renderListPointComponent(listPointComponent, tripEventsContainer) {
    render(listPointComponent, tripEventsContainer);
  }

  #renderSort() {
    this.#sortPointComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortPointComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point, destinations, offers) {
    this.#pointPresenter = new PointPresenter({
      listPointContainer:
        this.#listPointComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      isNewPoint: this.#isNewPoint
    });

    this.#pointPresenter.init(point, destinations, offers);
    this.#pointPresenters.set(point.id, this.#pointPresenter);
  }

  #clearListPoint({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }

    remove(this.#sortPointComponent);
    remove(this.#loadingComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderServerErrorComponent() {
    this.#serverErrorComponent = new ServerErrorView();
    render(this.#serverErrorComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPointComponent() {
    this.#noPointComponent = new NoPointView({ filterType: this.#filterType });
    render(this.#noPointComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderLoadingComponent() {
    render(this.#loadingComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #handleNewPointButtonClick = () => {
    this.#isNewPoint = true;
    this.#currentSortType = SortType.DEFAULT;
    this.#filtersModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
    this.#newPointButtonComponent.element.disabled = true;

    this.#newPointPresenter = new NewPointPresenter({
      listPointContainer: this.#listPointComponent.element,
      point: EMPTY_POINT,
      destinations: this.destinations,
      offers: this.offers,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onNewPointEditClose: this.#handleNewPointEditClose
    });

  };

  #handleNewPointEditClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
    this.#isNewPoint = false;
    this.#clearListPoint();

    this.#renderListPoint();
  };

  #handleSortTypeChange = (sortType) => {
    this.#isNewPoint = false;
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#isNewPoint = false;
    this.#newPointButtonComponent.element.disabled = false;

    this.#currentSortType = sortType;
    this.#clearListPoint();
    this.#renderListPoint();
  };


  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => {
      presenter.resetView();
    }
    );
  };

  #handleModeEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:

        this.#clearListPoint();

        this.#renderListPoint();
        break;
      case UpdateType.MAJOR:
        if (this.#isNewPoint && Object.values(FilterType).some((type) => type === data)) {
          this.#newPointButtonComponent.element.disabled = false;
          this.#isNewPoint = false;
        }

        this.#clearListPoint({ resetSortType: true });

        this.#renderListPoint();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderListPoint();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderServerErrorComponent();
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };
}

export default PagePresenter;
