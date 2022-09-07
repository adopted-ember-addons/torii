import bootstrapSession from '@adopted-ember-addons/torii/bootstrap/session';
import { getConfiguration } from '@adopted-ember-addons/torii/configuration';

export default {
  name: 'torii-session',
  after: 'torii',

  initialize(application) {
    if (arguments[1]) {
      // Ember < 2.1
      application = arguments[1];
    }

    const configuration = getConfiguration();
    if (!configuration.sessionServiceName) {
      return;
    }

    bootstrapSession(application, configuration.sessionServiceName);
  },
};
