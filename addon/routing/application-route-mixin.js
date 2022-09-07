/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';
import { getConfiguration } from '@adopted-ember-addons/torii/configuration';
import { getOwner } from '@ember/application';

export default Mixin.create({
  beforeModel(transition) {
    var route = this;
    var superBefore = this._super.apply(this, arguments);
    if (superBefore && superBefore.then) {
      return superBefore.then(function () {
        return route.checkLogin(transition);
      });
    } else {
      return route.checkLogin(transition);
    }
  },
  checkLogin() {
    let configuration = getConfiguration();
    let sessionService = getOwner(this).lookup(
      `service:${configuration.sessionServiceName}`
    );
    return sessionService.fetch().catch(function () {
      // no-op, cause no session is ok
    });
  },
});
