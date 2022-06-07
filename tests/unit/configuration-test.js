/* eslint-disable ember/no-classic-classes */
import EmberObject from '@ember/object';
import {
  configurable,
  configure,
} from '@adopted-ember-addons/torii/configuration';
import { module, test } from 'qunit';

var Testable = EmberObject.extend({
  name: 'test',
  required: configurable('apiKey'),
  defaulted: configurable('scope', 'email'),
  defaultedFunctionValue: 'found-via-get',
  defaultedFunction: configurable('redirectUri', function () {
    return this.defaultedFunctionValue;
  }),
});

module('Unit | Configuration', function (hooks) {
  hooks.beforeEach(function () {
    this.testable = Testable.create();
  });
  hooks.afterEach(function () {
    this.testable.destroy();
  });
  test('it should throw when reading a value not defaulted', function (assert) {
    configure({
      providers: {
        test: {},
      },
    });
    var threw = false,
      message;
    try {
      this.testable.get('required');
    } catch (e) {
      threw = true;
      message = e.message;
    }

    assert.ok(threw, 'read threw');
    assert.ok(
      /Expected configuration value apiKey to be defined for provider named test/.test(
        message
      ),
      'did not have proper error: ' + message
    );
  });

  test('it should read values', function (assert) {
    configure({
      providers: {
        test: {
          apiKey: 'item val',
        },
      },
    });
    var value = this.testable.get('required');
    assert.equal(value, 'item val');
  });

  test('it should read default values', function (assert) {
    configure({
      providers: {
        test: { apiKey: 'item val' },
      },
    });
    var value = this.testable.get('defaulted');
    assert.equal(value, 'email');
  });

  test('it should override default values', function (assert) {
    configure({
      providers: {
        test: {
          scope: 'baz',
        },
      },
    });
    var value = this.testable.get('defaulted');
    assert.equal(value, 'baz');
  });

  test('it read default values from a function', function (assert) {
    var value = this.testable.get('defaultedFunction');
    assert.equal(value, 'found-via-get');
  });
});
