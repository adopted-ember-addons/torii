import ToriiSessionService from '@adopted-ember-addons/torii/services/torii-session';

export default function (application, sessionName) {
  var sessionFactoryName = 'service:' + sessionName;
  application.register(sessionFactoryName, ToriiSessionService);
  application.inject(sessionFactoryName, 'torii', 'service:torii');
}
