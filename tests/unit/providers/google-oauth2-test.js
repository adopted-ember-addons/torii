import { run } from '@ember/runloop';
import {
  getConfiguration,
  configure,
} from '@adopted-ember-addons/torii/configuration';

import GoogleProvider from '@adopted-ember-addons/torii/providers/google-oauth2';
import QUnit from 'qunit';

let { module, test } = QUnit;
var provider;
let originalConfiguration;

module('Unit | Provider | GoogleAuth2Provider', {
  beforeEach() {
    originalConfiguration = getConfiguration();
    configure({
      providers: {
        'google-oauth2': {},
      },
    });
    provider = GoogleProvider.create();
  },
  afterEach() {
    run(provider, 'destroy');
    configure(originalConfiguration);
  },
});

test('Provider requires an apiKey', function (assert) {
  assert.throws(function () {
    provider.buildUrl();
  }, /Expected configuration value apiKey to be defined.*google-oauth2/);
});

test('Provider generates a URL with required config', function (assert) {
  configure({
    providers: {
      'google-oauth2': {
        apiKey: 'abcdef',
        approvalPrompt: 'force',
      },
    },
  });

  var expectedUrl =
    provider.get('baseUrl') +
    '?' +
    'response_type=code' +
    '&client_id=' +
    'abcdef' +
    '&redirect_uri=' +
    encodeURIComponent(provider.get('redirectUri')) +
    '&state=' +
    provider.get('state') +
    '&scope=email' +
    '&approval_prompt=force';

  assert.equal(provider.buildUrl(), expectedUrl, 'generates the correct URL');
});

test('Provider generates a URL with optional parameters', function (assert) {
  configure({
    providers: {
      'google-oauth2': {
        apiKey: 'abcdef',
        approvalPrompt: 'force',
        requestVisibleActions: 'http://some-url.com',
        accessType: 'offline',
        hd: 'google.com',
      },
    },
  });

  var expectedUrl =
    provider.get('baseUrl') +
    '?' +
    'response_type=code' +
    '&client_id=' +
    'abcdef' +
    '&redirect_uri=' +
    encodeURIComponent(provider.get('redirectUri')) +
    '&state=' +
    provider.get('state') +
    '&scope=email' +
    '&request_visible_actions=' +
    encodeURIComponent('http://some-url.com') +
    '&access_type=offline' +
    '&approval_prompt=force' +
    '&hd=google.com';

  assert.equal(provider.buildUrl(), expectedUrl, 'generates the correct URL');
});
