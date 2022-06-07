import {
  getConfiguration,
  configure,
} from '@adopted-ember-addons/torii/configuration';

import { module, test } from 'qunit';

import BaseProvider from '@adopted-ember-addons/torii/providers/oauth1';

var providerName = 'mock-oauth1';

var Provider = BaseProvider.extend({
  name: providerName,
  baseUrl: 'http://example.com',
  redirectUri: 'http://foo',
});

module(
  'Unit | Provider | MockOauth1Provider (oauth1 subclass)',
  function (hooks) {
    hooks.beforeEach(function () {
      this.originalConfiguration = getConfiguration();
      configure({
        providers: {
          [providerName]: {},
        },
      });
      this.provider = Provider.create();
    });
    hooks.afterEach(function () {
      this.provider.destroy();
      configure(this.originalConfiguration);
    });
    test('Provider requires a requestTokenUri', function (assert) {
      assert.throws(function () {
        this.provider.buildRequestTokenUrl();
      }, /Expected configuration value requestTokenUri to be defined.*mock-oauth1/);
    });

    test('buildRequestTokenUrl generates a URL with required config', function (assert) {
      configure({
        providers: {
          [providerName]: {
            requestTokenUri: 'http://expectedUrl.com',
          },
        },
      });
      assert.equal(
        this.provider.buildRequestTokenUrl(),
        'http://expectedUrl.com',
        'generates the correct URL'
      );
    });
  }
);
