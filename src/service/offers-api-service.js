import ApiService from '../framework/api-service.js';
import { PathName } from '../utils/const.js';

class OffersApiService extends ApiService {
  get offers() {
    return this._load({ url: PathName.OFFERS })
      .then(ApiService.parseResponse);
  }
}

export default OffersApiService;
