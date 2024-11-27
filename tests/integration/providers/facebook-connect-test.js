/* eslint-disable qunit/require-expect, qunit/literal-compare-order */
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { configure } from 'torii/configuration';
import {
  overrideLoadScript,
  resetLoadScript,
} from 'torii/providers/-private/utils';

import buildFBMock from '../../helpers/build-fb-mock';

var originalFB = window.FB;
let providerConfiguration;

module('Integration | Provider | Facebook Connect', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    providerConfiguration = {
      appId: 'dummy',
    };

    configure({
      providers: {
        'facebook-connect': providerConfiguration,
      },
    });

    window.FB = buildFBMock();
  });

  hooks.afterEach(function () {
    window.FB = originalFB;
    resetLoadScript();
  });

  test('Opens facebook connect session', function (assert) {
    overrideLoadScript(function () {
      window.fbAsyncInit();
    });

    const torii = this.owner.lookup('service:torii');

    return torii.open('facebook-connect').then(
      function () {
        assert.ok(true, 'Facebook connect opened');
      },
      function (e) {
        assert.ok(false, 'Facebook connect failed to open: ' + e.message);
      }
    );
  });

  test('Returns the scopes granted when configured', function (assert) {
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

    const torii = this.owner.lookup('service:torii');

    return torii.open('facebook-connect').then(function (data) {
      assert.strictEqual('email', data.grantedScopes);
    });
  });

  test('Supports custom auth_type on login', function (assert) {
    overrideLoadScript(function () {
      window.fbAsyncInit();
    });

    const torii = this.owner.lookup('service:torii');

    return torii
      .open('facebook-connect', { authType: 'rerequest' })
      .then(function (data) {
        assert.strictEqual(
          5678,
          data.expiresIn,
          'expriesIn extended when rerequest found'
        );
      });
  });
});
