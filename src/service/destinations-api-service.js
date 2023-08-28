import ApiService from '../framework/api-service.js';
import { PathName } from '../utils/const.js';

class DestinationsApiService extends ApiService {
  get destinations() {
    return this._load({ url: PathName.DESTINATIONS })
      .then(ApiService.parseResponse);
  }
}

export default DestinationsApiService;
