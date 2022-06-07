import Provider from '../../helpers/dummy-failure-provider';
import { module, test } from 'qunit';

module('Unit | Provider | DummyFailureProvider', function (hooks) {
  hooks.beforeEach(function () {
    this.provider = Provider.create();
  });
  hooks.afterEach(function () {
    this.provider.destroy();
  });
  test('Provider rejects on open', function (assert) {
    assert.expect(1);
    this.provider.open().then(
      function () {
        assert.ok(false, 'dummy-success fulfilled an open promise');
      },
      function () {
        assert.ok(true, 'dummy-success fails to resolve an open promise');
      }
    );
  });
});
