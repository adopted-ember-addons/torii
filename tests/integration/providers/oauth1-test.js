import OAuth1Provider from '@adopted-ember-addons/torii/providers/oauth1';
import { configure } from '@adopted-ember-addons/torii/configuration';
import configuration from '../../../config/environment';
import { module, test } from 'qunit';
import {
  setupContext,
  teardownContext,
  setupApplicationContext,
  setApplication,
} from '@ember/test-helpers';
import Application from 'dummy/app';

var opened,
  openedUrl,
  mockPopup = {
    open(url) {
      openedUrl = url;
      opened = true;
      return Promise.resolve({});
    },
  };

var requestTokenUri = 'http://localhost:3000/oauth/callback';
var providerName = 'oauth1';

module('Integration | Provider | Oauth1', function (hooks) {
  hooks.beforeEach(async function () {
    setApplication(Application.create(configuration.APP));
    await setupContext(this, {});
    await setupApplicationContext(this);
    this.owner.register('torii-service:popup', mockPopup, {
      instantiate: false,
    });
    this.owner.register('torii-provider:' + providerName, OAuth1Provider);

    this.torii = this.owner.lookup('service:torii');
    configure({
      providers: {
        [providerName]: {
          requestTokenUri: requestTokenUri,
        },
      },
    });
  });

  hooks.afterEach(async function () {
    opened = false;
    await teardownContext(this);
  });

  test('Opens a popup to the requestTokenUri', function (assert) {
    assert.expect(2);
    this.torii.open(providerName).finally(function () {
      assert.equal(openedUrl, requestTokenUri, 'opens with requestTokenUri');
      assert.ok(opened, 'Popup service is opened');
    });
  });
});
