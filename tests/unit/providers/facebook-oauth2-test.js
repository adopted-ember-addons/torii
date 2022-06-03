import { run } from '@ember/runloop';
import {
  getConfiguration,
  configure,
} from '@adopted-ember-addons/torii/configuration';

import FacebookProvider from '@adopted-ember-addons/torii/providers/facebook-oauth2';
import QUnit from 'qunit';

let { module, test } = QUnit;
var provider;
let originalConfiguration;

module('Unit | Provider | FacebookOAuth2Provider', {
  beforeEach() {
    originalConfiguration = getConfiguration();
    configure({
      providers: {
        'facebook-oauth2': {},
      },
    });
    provider = FacebookProvider.create();
  },
  afterEach() {
    run(provider, 'destroy');
    configure(originalConfiguration);
  },
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
    provider.buildUrl().startsWith('https://www.facebook.com/dialog/oauth')
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
    provider.buildUrl().startsWith('https://www.facebook.com/v3.2/dialog/oauth')
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
    provider.buildUrl();
  });
});
