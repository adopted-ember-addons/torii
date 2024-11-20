/* eslint-disable ember/no-classic-classes, ember/no-get */
import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import {
  configurable,
  configurableDecorator,
  configure,
} from 'torii/configuration';
import { module, test } from 'qunit';

module('Unit | Configuration', function (hooks) {
  let testable1, testable2, testables;

  const Testable = EmberObject.extend({
    name: 'test',
    required: configurable('apiKey'),
    defaulted: configurable('scope', 'email'),
    defaultedFunctionValue: 'found-via-get',
    defaultedFunction: configurable('redirectUri', function () {
      return this.get('defaultedFunctionValue');
    }),
  });

  const Testable2 = class extends EmberObject {
    name = 'test';
    @configurableDecorator('apiKey') required;
    @configurableDecorator('scope', 'email') defaulted;
    defaultedFunctionValue = 'found-via-get';

    // not supported by @computed due to limitations in decorators
    @configurableDecorator('redirectUri')
    get defaultedFunction() {
      return this.get('defaultedFunctionValue');
    }
  };

  hooks.beforeEach(function () {
    testable1 = Testable.create();
    testable2 = new Testable2();
    testables = { testable1, testable2 };
  });

  hooks.afterEach(function () {
    run(testable1, 'destroy');
    run(testable2, 'destroy');
  });

  test.each(
    'it should throw when reading a value not defaulted',
    ['testable1', 'testable2'],
    function (assert, testableToUse) {
      let testable = testables[testableToUse];
      let threw = false;
      let message;

      configure({
        providers: {
          test: {},
        },
      });

      try {
        testable.get('required');
      } catch (e) {
        threw = true;
        message = e.message;
      }

      assert.ok(threw, 'read threw');
      assert.ok(
        /Expected configuration value "?apiKey"? to be defined for provider named "?test"?/.test(
          message
        ),
        'did not have proper error: ' + message
      );
    }
  );

  test.each(
    'it should read values',
    ['testable1', 'testable2'],
    function (assert, testableToUse) {
      let testable = testables[testableToUse];
      configure({
        providers: {
          test: {
            apiKey: 'item val',
          },
        },
      });

      const value = testable.get('required');

      assert.strictEqual(value, 'item val');
    }
  );

  test.each(
    'it should read default values',
    ['testable1', 'testable2'],
    function (assert, testableToUse) {
      let testable = testables[testableToUse];
      configure({
        providers: {
          test: { apiKey: 'item val' },
        },
      });

      const value = testable.get('defaulted');

      assert.strictEqual(value, 'email');
    }
  );

  test.each(
    'it should override default values',
    ['testable1', 'testable2'],
    function (assert, testableToUse) {
      let testable = testables[testableToUse];
      configure({
        providers: {
          test: {
            scope: 'baz',
          },
        },
      });

      const value = testable.get('defaulted');

      assert.strictEqual(value, 'baz');
    }
  );

  test.each(
    'it read default values from a function',
    ['testable1', 'testable2'],
    function (assert, testableToUse) {
      let testable = testables[testableToUse];
      const value = testable.get('defaultedFunction');

      assert.strictEqual(value, 'found-via-get');
    }
  );
});
