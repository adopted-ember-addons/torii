/* eslint-disable ember/no-new-mixins, ember/no-get */
import { resolve } from 'rsvp';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { getOwner } from '@ember/application';
import { getConfiguration } from '@adopted-ember-addons/torii/configuration';

export default Mixin.create({
  beforeModel(transition) {
    var route = this;
    var superBefore = this._super.apply(this, arguments);
    if (superBefore && superBefore.then) {
      return superBefore.then(function () {
        return route.authenticate(transition);
      });
    } else {
      return route.authenticate(transition);
    }
  },
  authenticate(transition) {
    var configuration = getConfiguration();
    var route = this,
      session = getOwner(this).lookup(
        `service:${configuration.sessionServiceName}`
      ),
      isAuthenticated = get(session, 'isAuthenticated'),
      hasAttemptedAuth = isAuthenticated !== undefined;

    if (!isAuthenticated) {
      session.attemptedTransition = transition;

      if (hasAttemptedAuth) {
        return route.accessDenied(transition);
      } else {
        return session.fetch().catch(function () {
          return route.accessDenied(session.attemptedTransition);
        });
      }
    } else {
      // no-op; cause the user is already authenticated
      return resolve();
    }
  },
  accessDenied(transition) {
    transition.send('accessDenied', transition);
  },
});
