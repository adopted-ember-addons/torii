import {
  getConfiguration,
  configure,
} from '@adopted-ember-addons/torii/configuration';
import StripeConnectProvider from '@adopted-ember-addons/torii/providers/stripe-connect';
import { module, test } from 'qunit';

module('Unit | Provider | StripeConnectProvider', function (hooks) {
  hooks.beforeEach(function () {
    this.originalConfiguration = getConfiguration();
    configure({
      providers: {
        'stripe-connect': {},
      },
    });
    this.provider = StripeConnectProvider.create();
  });

  hooks.afterEach(function () {
    this.provider.destroy();
    configure(this.originalConfiguration);
  });

  test('Provider requires an apiKey', function (assert) {
    assert.throws(function () {
      this.provider.buildUrl();
    }, /Expected configuration value apiKey to be defined.*stripe-connect/);
  });

  test('Provider generates a URL with required config', function (assert) {
    configure({
      providers: {
        'stripe-connect': {
          apiKey: 'abcdef',
        },
      },
    });

    var expectedUrl =
      this.provider.get('baseUrl') +
      '?' +
      'response_type=code' +
      '&client_id=' +
      'abcdef' +
      '&redirect_uri=' +
      encodeURIComponent(this.provider.get('redirectUri')) +
      '&state=' +
      this.provider.get('state') +
      '&scope=read_write' +
      '&always_prompt=false';

    assert.equal(
      this.provider.buildUrl(),
      expectedUrl,
      'generates the correct URL'
    );
  });

  test('Provider generates a URL with optional parameters', function (assert) {
    configure({
      providers: {
        'stripe-connect': {
          apiKey: 'abcdef',
          scope: 'read_only',
          stripeLanding: 'login',
          alwaysPrompt: true,
        },
      },
    });

    var expectedUrl =
      this.provider.get('baseUrl') +
      '?' +
      'response_type=code' +
      '&client_id=' +
      'abcdef' +
      '&redirect_uri=' +
      encodeURIComponent(this.provider.get('redirectUri')) +
      '&state=' +
      this.provider.get('state') +
      '&scope=read_only' +
      '&stripe_landing=login' +
      '&always_prompt=true';

    assert.equal(
      this.provider.buildUrl(),
      expectedUrl,
      'generates the correct URL'
    );
  });
});
