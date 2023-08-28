import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoCostView(points, offers) {
  let costOffers = 0;
  const costPoints = points.reduce((sum, point) => sum + point.basePrice, 0);

  for (const point of points) {
    const pointOffers = offers.find((offer) => offer.type === point.type).offers;
    for (const offerId of point.offers) {
      costOffers += pointOffers.find((pointOffer) => pointOffer.id === offerId).price;
    }
  }

  return /*html*/`<p class="trip-info__cost">
Total: &euro;&nbsp;<span class="trip-info__cost-value">${costPoints + costOffers}</span>
            </p >`;
}
class TripInfoCostView extends AbstractView {
  #points = null;
  #offers = null;

  constructor({ points, offers }) {
    super();
    this.#points = points;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoCostView(this.#points, this.#offers);
  }
}

export default TripInfoCostView;
