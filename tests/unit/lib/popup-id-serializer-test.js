import PopupIdSerializer from '@adopted-ember-addons/torii/lib/popup-id-serializer';
import { module, test } from 'qunit';

module('Unit | Lib | PopupIdSerializer', function () {
  test('.serialize prepends a prefix before the popup id', function (assert) {
    var popupId = 'abc12345';

    assert.equal(
      'torii-popup:' + popupId,
      PopupIdSerializer.serialize(popupId)
    );
  });

  test('.deserialize extracts the popup id from the serialized string', function (assert) {
    var serializedPopupId = 'torii-popup:gfedc123';

    assert.equal(PopupIdSerializer.deserialize(serializedPopupId), 'gfedc123');
  });

  test('.deserialize returns null if not a properly serialized torii popup', function (assert) {
    var serializedPopupId = '';

    assert.equal(PopupIdSerializer.deserialize(serializedPopupId), null);
  });

  test('.serialize returns null if passed undefined', function (assert) {
    assert.equal(PopupIdSerializer.deserialize(undefined), null);
  });
});
