import { module, test } from 'qunit';
import UUIDGenerator from '@adopted-ember-addons/torii/lib/uuid-generator';

console.log('WAS HERE');

module('Unit | Lib | UUIDGenerator', function () {
  console.log('HERE AS WELL', test);
  test('exists', function (assert) {
    assert.ok(UUIDGenerator);
  });

  test('.generate returns a new uuid each time', function (assert) {
    var first = UUIDGenerator.generate();
    var second = UUIDGenerator.generate();

    assert.notEqual(first, second);
  });
});
