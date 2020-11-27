import {SEARCH_SETTINGS} from '../const.js';

const searchSettings = `${SEARCH_SETTINGS.LANGUAGE}${SEARCH_SETTINGS.PAGE}${SEARCH_SETTINGS.ADULT}`;

const Method = {
  GET: `GET`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, apiKey) {
    this._endPoint = endPoint;
    this._apiKey = apiKey;
  }

  getTrending() {
    return this._load({url: `trending/all/week`})
      .then(Api.toJSON)
      .then((response) => response.results);
  }

  getDetails(film) {
    return this._load({url: `${film.media_type}/${film.id}`})
      .then(Api.toJSON);
  }

  getCredits(film) {
    return this._load({url: `${film.media_type}/${film.id}/credits`})
      .then(Api.toJSON);
  }

  getIds(film) {
    return this._load({url: `${film.media_type}/${film.id}/external_ids`})
      .then(Api.toJSON);
  }

  searchFilm(query) {
    return this._load({url: `search/multi`}, `${searchSettings}&query=${query}`)
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }, settings = ``) {
    return fetch(
        `${this._endPoint}/${url}?api_key=${this._apiKey}${settings}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static toJSON(response) {
    return response.json();
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static catchError(error) {
    throw error;
  }
}