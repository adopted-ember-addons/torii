import EmberRouter from '@ember/routing/router';
import { later } from '@ember/runloop';
import { Promise as EmberPromise, resolve, reject } from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from '@adopted-ember-addons/torii/routing/authenticated-route-mixin';
import QUnit from 'qunit';
import {
  configure,
  getConfiguration,
} from '@adopted-ember-addons/torii/configuration';

let { module, test } = QUnit;
let originalConfiguration;

module('Unit | Routing | Authenticated Route Mixin', {
  beforeEach() {
    originalConfiguration = getConfiguration();
    configure({
      sessionServiceName: 'session',
    });
  },
  afterEach() {
    configure(originalConfiguration);
  },
});

test('beforeModel calls authenicate after _super#beforeModel', function (assert) {
  var route;
  var callOrder = [];
  route = Route.extend({
    beforeModel() {
      callOrder.push('super');
    },
  })
    .extend(AuthenticatedRouteMixin, {
      authenticate() {
        callOrder.push('mixin');
      },
    })
    .create();

  route.beforeModel();

  assert.deepEqual(
    callOrder,
    ['super', 'mixin'],
    'super#beforeModel is called before authenicate'
  );
});

test('route respects beforeModel super priority when promise is returned', function (assert) {
  var route;
  var callOrder = [];
  route = Route.extend({
    beforeModel() {
      return new EmberPromise(function (resolve) {
        later(function () {
          callOrder.push('super');
          resolve();
        }, 20);
      });
    },
  })
    .extend(AuthenticatedRouteMixin, {
      authenticate() {
        callOrder.push('mixin');
      },
    })
    .create();

  return route.beforeModel().then(function () {
    assert.deepEqual(
      callOrder,
      ['super', 'mixin'],
      'super#beforeModel is called before authenticate'
    );
  });
});

test('previously successful authentication results in successful resolution', function (assert) {
  assert.expect(1);
  var route = createAuthenticatedRoute({
    session: {
      isAuthenticated: true,
    },
  });

  return route.authenticate().then(function () {
    assert.ok(true);
  });
});

test('attempting authentication calls fetchDefaultProvider', function (assert) {
  assert.expect(1);
  var fetchCalled = false;
  var route = createAuthenticatedRoute({
    session: {
      isAuthenticated: undefined,
      fetch() {
        fetchCalled = true;
        return resolve();
      },
    },
  });
  return route.authenticate().then(function () {
    assert.ok(fetchCalled, 'fetch default provider was called');
  });
});

test('failed authentication calls accessDenied', function (assert) {
  assert.expect(2);
  var fetchCalled = false;
  var accessDeniedCalled = false;
  var route = createAuthenticatedRoute({
    session: {
      isAuthenticated: undefined,
      fetch() {
        fetchCalled = true;
        return reject();
      },
    },
    accessDenied() {
      accessDeniedCalled = true;
    },
  });
  return route.authenticate().then(function () {
    assert.ok(fetchCalled, 'fetch default provider was called');
    assert.ok(accessDeniedCalled, 'accessDenied was called');
  });
});

test('failed authentication causes accessDenied action to be sent', function (assert) {
  assert.expect(2);
  var fetchCalled = false;
  var sentActionName;
  var route = createAuthenticatedRoute({
    session: {
      isAuthenticated: undefined,
      fetch() {
        fetchCalled = true;
        return reject();
      },
    },
  });
  return route
    .authenticate({
      send(actionName) {
        sentActionName = actionName;
      },
    })
    .then(function () {
      assert.ok(fetchCalled, 'fetch default provider was called');
      assert.equal(
        sentActionName,
        'accessDenied',
        'accessDenied action was sent'
      );
    });
});

test('failed authentication causes accessDenied action to be sent with transition', function (assert) {
  assert.expect(2);
  var fetchCalled = false;
  var sentTransition;
  var transition = {
    targetName: 'custom.route',
  };

  var route = createAuthenticatedRoute({
    session: {
      isAuthenticated: undefined,
      fetch() {
        fetchCalled = true;
        return reject();
      },
    },

    accessDenied(transition) {
      sentTransition = transition;
    },
  });
  return route.authenticate(transition).then(function () {
    assert.ok(fetchCalled, 'fetch default provider was called');
    assert.deepEqual(sentTransition, transition, 'transition was sent');
  });
});

function createAuthenticatedRoute(attrs) {
  return EmberRouter.extend(AuthenticatedRouteMixin, attrs).create();
}
