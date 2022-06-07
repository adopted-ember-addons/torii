import {
  getConfiguration,
  configure,
} from '@adopted-ember-addons/torii/configuration';

import FacebookProvider from '@adopted-ember-addons/torii/providers/facebook-oauth2';
import { module, test } from 'qunit';

module('Unit | Provider | FacebookOAuth2Provider', function (hooks) {
  hooks.beforeEach(function () {
    this.originalConfiguration = getConfiguration();
    configure({
      providers: {
        'facebook-oauth2': {},
      },
    });
    this.provider = FacebookProvider.create();
  });

  hooks.afterEach(function () {
    this.provider.destroy();
    configure(this.originalConfiguration);
  });
  test('Provider generates an unversioned path if no API version is configured', function (assert) {
    configure({
      providers: {
        'facebook-oauth2': {
          apiKey: 'abcdef',
        },
      },
    });

    assert.ok(
      this.provider
        .buildUrl()
        .startsWith('https://www.facebook.com/dialog/oauth')
    );
  });

  test('Provider generates a versioned path if an API version is configured', function (assert) {
    configure({
      providers: {
        'facebook-oauth2': {
          apiKey: 'abcdef',
          apiVersion: 'v3.2',
        },
      },
    });

    assert.ok(
      this.provider
        .buildUrl()
        .startsWith('https://www.facebook.com/v3.2/dialog/oauth')
    );
  });

  test('Throws an error if the version does not have the right shape', function (assert) {
    configure({
      providers: {
        'facebook-oauth2': {
          apiKey: 'abcdef',
          apiVersion: '3.2',
        },
      },
    });

    assert.throws(function () {
      this.provider.buildUrl();
    });
  });
});
