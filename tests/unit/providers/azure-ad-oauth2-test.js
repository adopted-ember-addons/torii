import {
  getConfiguration,
  configure,
} from '@adopted-ember-addons/torii/configuration';
import AzureAdProvider from '@adopted-ember-addons/torii/providers/azure-ad-oauth2';
import { module, test } from 'qunit';

module('Unit | Provider | AzureAdOAuth2Provider', function (hooks) {
  hooks.beforeEach(function () {
    this.originalConfiguration = getConfiguration();
    configure({
      providers: {
        'azure-ad-oauth2': {},
      },
    });
    this.provider = AzureAdProvider.create();
  });
  hooks.afterEach(function () {
    this.provider.destroy();
    configure(this.originalConfiguration);
  });
  test('Provider requires an apiKey', function (assert) {
    assert.throws(function () {
      this.provider.buildUrl();
    }, /Expected configuration value apiKey to be defined.*azure-ad-oauth2/);
  });

  test('Provider generates a URL with required config', function (assert) {
    configure({
      providers: {
        'azure-ad-oauth2': { clientId: 'abcdef' },
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
      '&api-version=1.0';

    assert.equal(
      this.provider.buildUrl(),
      expectedUrl,
      'generates the correct URL'
    );
  });

  test('Provider generates a URL with required config including the tennantId', function (assert) {
    configure({
      providers: {
        'azure-ad-oauth2': {
          clientId: 'abcdef',
          tennantId: 'very-long-guid',
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
      '&api-version=1.0';

    assert.equal(
      this.provider.buildUrl(),
      expectedUrl,
      'generates the correct URL'
    );

    assert.notEqual(this.provider.get('baseUrl').indexOf('very-long-guid'), -1);
  });

  test('Provider generates a URL with required config when using id_token', function (assert) {
    configure({
      providers: {
        'azure-ad-oauth2': {
          clientId: 'abcdef',
          responseType: 'id_token',
          responseMode: 'query',
          scope: 'openid email',
        },
      },
    });

    var expectedUrl =
      this.provider.get('baseUrl') +
      '?' +
      'response_type=id_token' +
      '&client_id=' +
      'abcdef' +
      '&redirect_uri=' +
      encodeURIComponent(this.provider.get('redirectUri')) +
      '&state=' +
      this.provider.get('state') +
      '&api-version=1.0' +
      '&scope=openid%20email' +
      '&response_mode=query';

    assert.equal(
      this.provider.buildUrl(),
      expectedUrl,
      'generates the correct URL'
    );
  });
});
