import ToriiSessionService from '@adopted-ember-addons/torii/services/torii-session';

export default function (application, sessionName) {
  var sessionFactoryName = 'service:' + sessionName;
  application.register(sessionFactoryName, ToriiSessionService);
  application.inject(sessionFactoryName, 'torii', 'service:torii'); // TODO: .inject is deprecated / does nothing as of 4.0.0
  application.inject('route', sessionName, sessionFactoryName); // TODO: .inject is deprecated / does nothing as of 4.0.0
  application.inject('controller', sessionName, sessionFactoryName); // TODO: .inject is deprecated / does nothing as of 4.0.0
}
