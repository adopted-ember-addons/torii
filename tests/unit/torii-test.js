import Torii from '@adopted-ember-addons/torii/services/torii';
import QUnit from 'qunit';

let { module, test } = QUnit;

module('Unit | Torii');

test('exists', function (assert) {
  assert.ok(Torii);
});
