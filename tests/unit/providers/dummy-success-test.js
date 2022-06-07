import Provider from '../../helpers/dummy-success-provider';
import { module, test } from 'qunit';

module('Unit | Provider | DummySuccessProvider', function (hooks) {
  hooks.beforeEach(function () {
    this.provider = Provider.create();
  });
  hooks.afterEach(function () {
    this.provider.destroy();
  });

  test('Provider fulfills on open', function (assert) {
    assert.expect(1);
    this.provider.open().then(
      function () {
        assert.ok(true, 'dummy-success resolves an open promise');
      },
      function () {
        assert.ok(false, 'dummy-success failed to resolves an open promise');
      }
    );
  });
});
