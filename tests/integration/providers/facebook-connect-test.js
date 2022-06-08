import buildFBMock from '../../helpers/build-fb-mock';
import { configure } from '@adopted-ember-addons/torii/configuration';
import { module, test } from 'qunit';
import {
  overrideLoadScript,
  resetLoadScript,
} from '@adopted-ember-addons/torii/providers/-private/utils';
import Application from 'dummy/app';
import configuration from '../../../config/environment';
import {
  setupContext,
  teardownContext,
  setupApplicationContext,
  setApplication,
} from '@ember/test-helpers';

var originalFB = window.FB;

const providerConfiguration = {
  appId: 'dummy',
};

module('Integration | Provider | Facebook Connect', function (hooks) {
  hooks.beforeEach(async function () {
    setApplication(Application.create(configuration.APP));
    await setupContext(this, {});
    await setupApplicationContext(this);
    configure({
      providers: {
        'facebook-connect': providerConfiguration,
      },
    });
    this.torii = this.owner.lookup('service:torii');

    window.FB = buildFBMock();
  });

  hooks.afterEach(async function () {
    window.FB = originalFB;
    resetLoadScript();
    await teardownContext(this);
  });

  test('Opens facebook connect session', function (assert) {
    assert.expect(1);
    overrideLoadScript(function () {
      window.fbAsyncInit();
    });
    this.torii.open('facebook-connect').then(
      function () {
        assert.ok(true, 'Facebook connect opened');
      },
      function (e) {
        assert.ok(false, 'Facebook connect failed to open: ' + e.message);
      }
    );
  });

  test('Returns the scopes granted when configured', function (assert) {
    assert.expect(1);
    overrideLoadScript(function () {
      window.fbAsyncInit();
    });
    configure({
      providers: {
        'facebook-connect': Object.assign({}, providerConfiguration, {
          returnScopes: true,
        }),
      },
    });
    this.torii.open('facebook-connect').then(function (data) {
      assert.equal(data.grantedScopes, 'email');
    });
  });

  test('Supports custom auth_type on login', function (assert) {
    assert.expect(1);
    overrideLoadScript(function () {
      window.fbAsyncInit();
    });
    this.torii
      .open('facebook-connect', { authType: 'rerequest' })
      .then(function (data) {
        assert.equal(
          data.expiresIn,
          5678,
          'expriesIn extended when rerequest found'
        );
      });
  });
});
