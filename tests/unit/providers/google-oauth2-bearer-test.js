import {
  getConfiguration,
  configure,
} from '@adopted-ember-addons/torii/configuration';

import GoogleBearerProvider from '@adopted-ember-addons/torii/providers/google-oauth2-bearer';
import { module, test } from 'qunit';

module('Unit | Provider | GoogleAuth2BearerProvider', function (hooks) {
  hooks.beforeEach(function () {
    this.originalConfiguration = getConfiguration();
    configure({
      providers: {
        'google-oauth2-bearer': {},
      },
    });
    this.provider = GoogleBearerProvider.create();
  });
  hooks.afterEach(function () {
    this.provider.destroy();
    configure(this.originalConfiguration);
  });

  test('Provider requires an apiKey', function (assert) {
    assert.throws(function () {
      this.provider.buildUrl();
    }, /Expected configuration value apiKey to be defined.*google-oauth2-bearer/);
  });

  test('Provider generates a URL with required config', function (assert) {
    configure({
      providers: {
        'google-oauth2-bearer': {
          apiKey: 'abcdef',
        },
      },
    });

    var expectedUrl =
      this.provider.get('baseUrl') +
      '?' +
      'response_type=token' +
      '&client_id=' +
      'abcdef' +
      '&redirect_uri=' +
      encodeURIComponent(this.provider.get('redirectUri')) +
      '&state=' +
      this.provider.get('state') +
      '&scope=email';

    assert.equal(
      this.provider.buildUrl(),
      expectedUrl,
      'generates the correct URL'
    );
  });

  test('Provider generates a URL with optional parameters', function (assert) {
    configure({
      providers: {
        'google-oauth2-bearer': {
          apiKey: 'abcdef',
          requestVisibleActions: 'http://some-url.com',
          hd: 'google.com',
        },
      },
    });

    var expectedUrl =
      this.provider.get('baseUrl') +
      '?' +
      'response_type=token' +
      '&client_id=' +
      'abcdef' +
      '&redirect_uri=' +
      encodeURIComponent(this.provider.get('redirectUri')) +
      '&state=' +
      this.provider.get('state') +
      '&scope=email' +
      '&request_visible_actions=' +
      encodeURIComponent('http://some-url.com') +
      '&hd=google.com';

    assert.equal(
      this.provider.buildUrl(),
      expectedUrl,
      'generates the correct URL'
    );
  });
});
