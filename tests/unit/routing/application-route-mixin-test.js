import { later } from '@ember/runloop';
import { Promise as EmberPromise, reject } from 'rsvp';
import Route from '@ember/routing/route';
import ApplicationRouteMixin from '@adopted-ember-addons/torii/routing/application-route-mixin';
import QUnit from 'qunit';
import {
  configure,
  getConfiguration,
} from '@adopted-ember-addons/torii/configuration';

let { module, test } = QUnit;
let originalConfiguration;

module('Unit | Routing | Application Route Mixin', {
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

test('beforeModel calls checkLogin after _super#beforeModel', function (assert) {
  var route;
  var callOrder = [];
  route = Route.extend({
    beforeModel() {
      callOrder.push('super');
    },
  })
    .extend(ApplicationRouteMixin, {
      checkLogin() {
        callOrder.push('mixin');
      },
    })
    .create();

  route.beforeModel();

  assert.deepEqual(
    callOrder,
    ['super', 'mixin'],
    'super#beforeModel is called mixin#beforeModel'
  );
});

test('beforeModel calls checkLogin after promise from _super#beforeModel is resolved', function (assert) {
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
    .extend(ApplicationRouteMixin, {
      checkLogin() {
        callOrder.push('mixin');
      },
    })
    .create();

  return route.beforeModel().then(function () {
    assert.deepEqual(
      callOrder,
      ['super', 'mixin'],
      'super#beforeModel is called before mixin#beforeModel'
    );
  });
});

test('checkLogic fails silently when no session is available', function (assert) {
  assert.expect(2);

  var fetchCalled = false;
  var route = Route.extend(ApplicationRouteMixin, {
    session: {
      fetch() {
        fetchCalled = true;
        return reject('no session is available');
      },
    },
  }).create();

  return route.checkLogin().then(function () {
    assert.ok(fetchCalled, 'fetch default provider was called');
    assert.ok('successful callback in spite of rejection');
  });
});
