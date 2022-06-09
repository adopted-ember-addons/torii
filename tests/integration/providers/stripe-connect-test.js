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

var mockPopup = new MockPopup();

var failPopup = new MockPopup({ state: 'invalid-state' });

module('Integration | Provider | Stripe Connect', function (hooks) {
  hooks.beforeEach(async function () {
    setApplication(Application.create(configuration.APP));
    await setupContext(this, {});
    await setupApplicationContext(this);
    this.owner.register('torii-service:mock-popup', mockPopup, {
      instantiate: false,
    });
    this.owner.register('torii-service:fail-popup', failPopup, {
      instantiate: false,
    });
    this.owner.inject('torii-provider', 'popup', 'torii-service:mock-popup');
    this.torii = this.owner.lookup('service:torii');
    configure({
      providers: {
        'stripe-connect': { apiKey: 'dummy' },
      },
    });
  });

  hooks.afterEach(async function () {
    mockPopup.opened = false;
    await teardownContext(this);
  });
  test('Opens a popup to Stripe', function (assert) {
    assert.expect(1);
    this.torii.open('stripe-connect').finally(function () {
      assert.ok(mockPopup.opened, 'Popup service is opened');
    });
  });

  test('Validates the state parameter in the response', function (assert) {
    assert.expect(1);
    this.owner.inject('torii-provider', 'popup', 'torii-service:fail-popup');

    this.torii.open('stripe-connect').then(null, function (e) {
      assert.ok(
        /has an incorrect session state/.test(e.message),
        'authentication fails due to invalid session state response'
      );
    });
  });
});
