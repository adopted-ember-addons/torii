import SessionService from '@adopted-ember-addons/torii/services/torii-session';
import DummyAdapter from '../helpers/dummy-adapter';
import DummySuccessProvider from '../helpers/dummy-success-provider';
import DummyFailureProvider from '../helpers/dummy-failure-provider';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Session (open)', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('torii-provider:dummy-success', DummySuccessProvider);
    this.owner.register('torii-provider:dummy-failure', DummyFailureProvider);
    this.session = this.owner.lookup('service:session');
  });

  test('session starts in unauthenticated unopened state', function (assert) {
    assert.notOk(this.session.get('isOpening'), 'not opening');
    assert.notOk(this.session.get('isAuthenticated'), 'not authenticated');
  });

  test('starting auth sets isOpening to true', function (assert) {
    assert.expect(2);
    var provider = this.owner.lookup('torii-provider:dummy-success');
    var oldOpen = provider.open;

    var session = this.session;

    provider.open = function () {
      assert.ok(true, 'calls provider.open');
      assert.ok(session.get('isOpening'), 'session.isOpening is true');

      return oldOpen.apply(this, arguments);
    };

    this.owner.register('torii-adapter:dummy-success', DummyAdapter);
    this.session.open('dummy-success');
  });

  test('successful auth sets isAuthenticated to true', function (assert) {
    assert.expect(2);
    this.owner.register('torii-adapter:dummy-success', DummyAdapter);
    var session = this.session;
    session.open('dummy-success').then(function () {
      assert.notOk(session.get('isOpening'), 'session is no longer opening');
      assert.ok(session.get('isAuthenticated'), 'session is authenticated');
    });
  });

  test('failed auth sets isAuthenticated to false, sets error', function (assert) {
    assert.expect(4);
    var session = this.session;
    session.open('dummy-failure').then(
      function () {
        assert.ok(false, 'should not resolve promise');
      },
      function () {
        assert.ok(true, 'rejects promise');

        assert.notOk(session.get('isOpening'), 'session is no longer opening');
        assert.notOk(
          session.get('isAuthenticated'),
          'session is not authenticated'
        );
        assert.ok(session.get('errorMessage'), 'session has error message');
      }
    );
  });
});

module('Integration | Session (close) ', function (hooks) {
  setupTest(hooks);
  hooks.beforeEach(function () {
    this.session = this.owner.lookup('service:session');
    this.adapter = this.owner.lookup('torii-adapter:application');
    this.user = { email: 'fake@fake.com' };
    this.session.get('stateMachine').transitionTo('opening');
    this.session
      .get('stateMachine')
      .send('finishOpen', { currentUser: this.user });
  });

  test('session starts in authenticated opened state', function (assert) {
    assert.ok(this.session.get('isAuthenticated'), 'not authenticated');
    assert.deepEqual(
      this.session.get('currentUser'),
      this.user,
      'has currentUser'
    );
  });

  test('starting close sets isWorking to true', function (assert) {
    assert.expect(2);
    const session = this.session;
    this.adapter.close = function () {
      assert.ok(true, 'calls adapter.close');
      assert.ok(session.get('isWorking'), 'session.isWorking is true');
      return Promise.resolve();
    };
    this.session.close();
  });

  test('finished close sets isWorking to false, isAuthenticated false', function (assert) {
    assert.expect(3);
    const session = this.session;
    this.adapter.close = function () {
      return Promise.resolve();
    };

    session.close().then(
      function () {
        assert.notOk(session.get('isWorking'), 'isWorking is false');
        assert.notOk(
          session.get('isAuthenticated'),
          'isAuthenticated is false'
        );
        assert.notOk(session.get('currentUser'), 'currentUser is false');
      },
      function (err) {
        assert.ok(false, 'promise rejected with error: ' + err);
      }
    );
  });

  test('failed close sets isWorking to false, isAuthenticated true, error', function (assert) {
    assert.expect(3);
    const session = this.session;
    const error = 'Oh my';

    this.adapter.close = function () {
      return Promise.reject(error);
    };

    session.close().then(
      function () {
        assert.ok(false, 'promise resolved');
      },
      function (error) {
        assert.notOk(session.get('isWorking'), 'isWorking is false');
        assert.notOk(session.get('isAuthenticated'), 'isAuthenticated is true');
        assert.equal(session.get('errorMessage'), error, 'error is present');
      }
    );
  });
});
