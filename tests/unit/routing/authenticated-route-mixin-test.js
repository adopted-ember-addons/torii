/* eslint-disable prettier/prettier, ember/no-classic-classes, qunit/require-expect */
import EmberRouter from '@ember/routing/router';
import { later } from '@ember/runloop';
import { Promise as EmberPromise, resolve, reject } from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';
import { module, test } from 'qunit';
import { configure, getConfiguration } from 'torii/configuration';
import { setupTest } from 'ember-qunit';
import { inject as service } from '@ember/service';

let originalConfiguration, createAuthenticatedRoute;

module('Unit | Routing | Authenticated Route Mixin', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    originalConfiguration = getConfiguration();
    configure({
      sessionServiceName: 'session',
    });

    createAuthenticatedRoute = (attrs) => {
      class AuthenticatedRoute extends EmberRouter.extend(AuthenticatedRouteMixin, attrs) {}
      return new AuthenticatedRoute(this.owner);
    };
  });

  hooks.afterEach(function () {
    configure(originalConfiguration);
  });

  test('beforeModel calls authenicate after _super#beforeModel', function (assert) {
    const callOrder = [];
    const route = Route.extend({
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
    const callOrder = [];
    const route = Route.extend({
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
    const route = createAuthenticatedRoute({
      session: {
        isAuthenticated: true,
      },
    });

    return route.authenticate({ send() {} }).then(function () {
      assert.ok(true);
    });
  });

  test('attempting authentication calls fetchDefaultProvider', function (assert) {
    assert.expect(1);

    let fetchCalled = false;

    this.owner.register('service:session', {
      isAuthenticated: undefined,
      fetch() {
        fetchCalled = true;
        return resolve();
      },
    }, { instantiate: false });
    const route = createAuthenticatedRoute({
      session: service(),
    });
    return route.authenticate({ send() {} }).then(function () {
      assert.ok(fetchCalled, 'fetch default provider was called');
    });
  });

  test('failed authentication calls accessDenied', function (assert) {
    assert.expect(2);

    let fetchCalled = false;
    let accessDeniedCalled = false;

    this.owner.register('service:session', {
      isAuthenticated: undefined,
      fetch() {
        fetchCalled = true;
        return reject();
      },
    }, { instantiate: false });
    const route = createAuthenticatedRoute({
      session: service(),
      accessDenied() {
        accessDeniedCalled = true;
      },
    });
    return route.authenticate({ send() {} }).then(function () {
      assert.ok(fetchCalled, 'fetch default provider was called');
      assert.ok(accessDeniedCalled, 'accessDenied was called');
    });
  });

  test('failed authentication causes accessDenied action to be sent', function (assert) {
    assert.expect(2);

    let sentActionName;
    let fetchCalled = false;

    this.owner.register('service:session', {
      isAuthenticated: undefined,
      fetch() {
        fetchCalled = true;
        return reject();
      },
    }, { instantiate: false });
    const route = createAuthenticatedRoute({
      session: service(),
    });
    return route
      .authenticate({
        send(actionName) {
          sentActionName = actionName;
        },
      })
      .then(function () {
        assert.ok(fetchCalled, 'fetch default provider was called');
        assert.strictEqual(
          sentActionName,
          'accessDenied',
          'accessDenied action was sent'
        );
      });
  });

  test('failed authentication causes accessDenied action to be sent with transition', function (assert) {
    assert.expect(2);

    let sentTransition;
    let fetchCalled = false;

    const transition = {
      targetName: 'custom.route',
    };

    this.owner.register('service:session', {
      isAuthenticated: undefined,
      fetch() {
        fetchCalled = true;
        return reject();
      },
    }, { instantiate: false });

    const route = createAuthenticatedRoute({
      session: service(),

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
