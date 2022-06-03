import { resolve } from 'rsvp';
import ParseQueryString from '@adopted-ember-addons/torii/lib/parse-query-string';

var MockPopup = function (options) {
  options = options || {};

  this.opened = false;
  this.state = options.state;
};

MockPopup.prototype.open = function (url, keys) {
  this.opened = true;

  var parser = ParseQueryString.create({ url: url, keys: ['state'] }),
    data = parser.parse(),
    state = data.state;

  if (this.state !== undefined) {
    state = this.state;
  }

  var response = { code: 'test' };

  if (keys.indexOf('state') !== -1) {
    response.state = state;
  }

  return resolve(response);
};

export default MockPopup;
