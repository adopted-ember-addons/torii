import { configure } from '@adopted-ember-addons/torii/configuration';
import { module, test } from 'qunit';
import configuration from '../../../config/environment';
import {
  setupContext,
  teardownContext,
  setupApplicationContext,
  setApplication,
} from '@ember/test-helpers';
import Application from 'dummy/app';

var opened, providerConfig;

module('Integration | Provider | Google Bearer', function (hooks) {
  hooks.beforeEach(async function () {
    setApplication(Application.create(configuration.APP));
    await setupContext(this, {});
    await setupApplicationContext(this);

    this.mockPopup = {
      open() {
        opened = true;
        return Promise.resolve({ access_token: 'test' });
      },
    };
    this.owner.register('torii-service:popup', this.mockPopup, {
      instantiate: false,
    });

    this.torii = this.owner.lookup('service:torii');

    providerConfig = { apiKey: 'dummy' };

    configure({
      providers: {
        'google-oauth2-bearer': providerConfig,
      },
    });
  });

  hooks.afterEach(async function () {
    opened = false;
    await teardownContext(this);
  });
  test('Opens a popup to Google', function (assert) {
    assert.expect(1);
    this.torii.open('google-oauth2-bearer').finally(function () {
      assert.ok(opened, 'Popup service is opened');
    });
  });

  test('Opens a popup to Google with request_visible_actions', function (assert) {
    assert.expect(1);
    configure({
      providers: {
        'google-oauth2-bearer': Object.assign({}, providerConfig, {
          requestVisibleActions: 'http://some-url.com',
        }),
      },
    });
    this.mockPopup.open = function (url) {
      assert.ok(
        url.indexOf('request_visible_actions=http%3A%2F%2Fsome-url.com') > -1,
        'request_visible_actions is present'
      );
      return Promise.resolve({ access_token: 'test' });
    };
    this.torii.open('google-oauth2-bearer');
  });
});
