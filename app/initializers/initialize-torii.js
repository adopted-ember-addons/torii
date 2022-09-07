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
  },
};

export default initializer;
