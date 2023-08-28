import AbstractView from '../framework/view/abstract-view';


function createLoadingViewTemplate() {
  return (`<p class="trip-events__msg">
  Loading...
  </p>`);
}

class LoadingView extends AbstractView {

  get template() {
    return createLoadingViewTemplate();
  }
}

export default LoadingView;
