import { configure } from '@adopted-ember-addons/torii/configuration';
import MockPopup from '../../helpers/mock-popup';
import { module, test } from 'qunit';
import configuration from '../../../config/environment';

import {
  setupContext,
  teardownContext,
  setupApplicationContext,
  setApplication,
} from '@ember/test-helpers';

import Application from 'dummy/app';

module('Integration | Provider | AzureAd', function (hooks) {
  hooks.beforeEach(async function () {
    setApplication(Application.create(configuration.APP));
    await setupContext(this, {});
    await setupApplicationContext(this);

    this.mockPopup = new MockPopup();
    this.failPopup = new MockPopup({ state: 'invalid-state' });
    this.owner.register('torii-service:mock-popup', this.mockPopup, {
      instantiate: false,
    });
    this.owner.register('torii-service:fail-popup', this.failPopup, {
      instantiate: false,
    });
    configure({
      providers: {
        'azure-ad-oauth2': {
          apiKey: 'dummy',
        },
      },
    });
    this.owner.inject('torii-provider', 'popup', 'torii-service:mock-popup');
    this.torii = this.owner.lookup('service:torii');
  });

  hooks.afterEach(async function () {
    this.mockPopup.opened = false;
    this.failPopup.opened = false;
    await teardownContext(this);
    //this.torii.close('azure-ad-oauth2');
  });

  test('Opens a popup to AzureAd', function (assert) {
    assert.expect(1);
    const mockPopup = this.mockPopup;
    this.torii.open('azure-ad-oauth2').finally(function () {
      assert.ok(mockPopup.opened, 'Popup service is opened');
    });
  });

  test('Validates the state parameter in the response', async function (assert) {
    assert.expect(1);
    this.owner.inject('torii-provider', 'popup', 'torii-service:fail-popup');
    await this.torii.open('azure-ad-oauth2').catch(function (e) {
      assert.ok(
        /has an incorrect session state/.test(e.message),
        'authentication fails due to invalid session state response'
      );
    });
  });
});
