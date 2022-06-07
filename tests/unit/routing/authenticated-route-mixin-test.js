/* eslint-disable ember/no-classic-classes */
import { later } from '@ember/runloop';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from '@adopted-ember-addons/torii/routing/authenticated-route-mixin';
import { module, test } from 'qunit';
import {
  configure,
  getConfiguration,
} from '@adopted-ember-addons/torii/configuration';

function createAuthenticatedRoute(attrs) {
  return Route.extend(AuthenticatedRouteMixin, attrs).create();
}

module('Unit | Routing | Authenticated Route Mixin', function (hooks) {
  hooks.beforeEach(function () {
    this.originalConfiguration = getConfiguration();
    configure({
      sessionServiceName: 'session',
    });
  });
  hooks.afterEach(function () {
    configure(this.originalConfiguration);
  });

  test('beforeModel calls authenticate after _super#beforeModel', function (assert) {
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
    assert.expect(1);
    var route;
    var callOrder = [];
    route = Route.extend({
      beforeModel() {
        return new Promise(function (resolve) {
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
          return Promise.resolve();
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
          return Promise.reject();
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
          return Promise.reject();
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
          return Promise.reject();
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
});
