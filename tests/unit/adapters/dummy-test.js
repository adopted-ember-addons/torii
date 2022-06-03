import DummyAdapter from '../../helpers/dummy-adapter';
import { module, test } from 'qunit';

module('Unit | Adapter | DummyAdapter', function (hooks) {
  hooks.beforeEach(function () {
    this.adapter = DummyAdapter.create();
  });

  hooks.afterEach(function () {
    this.adapter.destroy();
  });

  test('open resolves with a user', function (assert) {
    assert.expect(2);
    this.adapter.open().then(function (data) {
      assert.ok(true, 'resolved');
      assert.ok(data.currentUser.email, 'dummy user has email');
    });
  });
});
