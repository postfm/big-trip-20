import AbstractView from '../framework/view/abstract-view';

function createTripInfoView() {
  return '<section class="trip-main__trip-info  trip-info"></section>';
}

class TripInfoView extends AbstractView {
  get template() {
    return createTripInfoView();
  }
}

export default TripInfoView;
