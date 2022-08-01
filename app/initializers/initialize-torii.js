import bootstrapTorii from '@adopted-ember-addons/torii/bootstrap/torii';
import { configure } from '@adopted-ember-addons/torii/configuration';
import config from '../config/environment';

var initializer = {
  name: 'torii',
  initialize(application) {
    if (arguments[1]) {
      // Ember < 2.1
      application = arguments[1];
    }
    configure(config.torii || {});
    bootstrapTorii(application);
    application.inject('route', 'torii', 'service:torii'); // TODO: .inject is deprecated / does nothing as of 4.0.0
  },
};

export default initializer;
