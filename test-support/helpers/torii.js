import config from '../../config/environment';

const {
  torii: { sessionServiceName },
} = config;

export function stubValidSession(container, sessionData) {
  let session = container.lookup(`service:${sessionServiceName}`);

  let sm = session.get('stateMachine');
  sm.send('startOpen');
  sm.send('finishOpen', sessionData);
}
