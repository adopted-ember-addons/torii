/* eslint-disable ember/no-classic-classes */
import Popup from '@adopted-ember-addons/torii/services/popup';
import PopupIdSerializer from '@adopted-ember-addons/torii/lib/popup-id-serializer';
import { CURRENT_REQUEST_KEY } from '@adopted-ember-addons/torii/mixins/ui-service-mixin';
import { module, test } from 'qunit';

var popup;
var originalWindowOpen = window.open;

var buildMockWindow = function (windowName) {
  windowName = windowName || '';
  return {
    name: windowName,
    focus() {},
    close() {},
  };
};

var buildPopupIdGenerator = function (popupId) {
  return {
    generate() {
      return popupId;
    },
  };
};

var buildMockStorageEvent = function (popupId, redirectUrl) {
  return new StorageEvent('storage', {
    key: PopupIdSerializer.serialize(popupId),
    newValue: redirectUrl,
  });
};

module('Unit | Service | Popup', function (hooks) {
  hooks.beforeEach(function () {
    this.popup = Popup.create();
    localStorage.removeItem(CURRENT_REQUEST_KEY);
  });

  hooks.afterEach(function () {
    localStorage.removeItem(CURRENT_REQUEST_KEY);
    window.open = originalWindowOpen;
    this.popup.destroy();
  });

  test('open resolves based on popup window', function (assert) {
    let done = assert.async();
    assert.expect(8);
    var expectedUrl = 'http://authServer';
    var redirectUrl = 'http://localserver?code=fr';
    var popupId = '09123-asdf';
    var mockWindow = null;

    popup = Popup.create({ remoteIdGenerator: buildPopupIdGenerator(popupId) });

    window.open = function (url, name) {
      assert.ok(true, 'calls window.open');
      assert.equal(url, expectedUrl, 'opens with expected url');

      assert.equal(
        PopupIdSerializer.serialize(popupId),
        localStorage.getItem(CURRENT_REQUEST_KEY),
        'adds the key to the current request item'
      );

      mockWindow = buildMockWindow(name);
      return mockWindow;
    };

    popup
      .open(expectedUrl, ['code'])
      .then(
        function (data) {
          assert.ok(true, 'resolves promise');
          assert.equal(
            popupId,
            PopupIdSerializer.deserialize(mockWindow.name),
            "sets the window's name properly"
          );
          assert.deepEqual(data, { code: 'fr' }, 'resolves with expected data');
          assert.equal(
            localStorage.getItem(CURRENT_REQUEST_KEY),
            null,
            'removes the key from local storage'
          );
          assert.equal(
            localStorage.getItem(PopupIdSerializer.serialize(popupId)),
            null,
            'removes the key from local storage'
          );
        },
        function () {
          assert.ok(false, 'rejected the open promise');
        }
      )
      .finally(function () {
        done();
      });

    localStorage.setItem(PopupIdSerializer.serialize(popupId), redirectUrl);
    // Need to manually trigger storage event, since it doesn't fire in the current window
    window.dispatchEvent(buildMockStorageEvent(popupId, redirectUrl));
  });

  test('open rejects when window does not open', function (assert) {
    assert.expect(3);
    let done = assert.async();
    var closedWindow = buildMockWindow();
    closedWindow.closed = true;
    window.open = function () {
      assert.ok(true, 'calls window.open');
      return closedWindow;
    };

    this.popup
      .open('http://some-url.com', ['code'])
      .then(
        function () {
          assert.ok(false, 'resolves promise');
        },
        function () {
          assert.ok(true, 'rejected the open promise');
          assert.notOk(
            localStorage.getItem(CURRENT_REQUEST_KEY),
            'current request key is removed'
          );
        }
      )
      .finally(function () {
        done();
      });
  });

  test('open does not resolve when receiving a storage event for the wrong popup id', function (assert) {
    assert.expect(3);
    //let done = assert.async();

    window.open = function () {
      assert.ok(true, 'calls window.open');
      return buildMockWindow();
    };

    var promise = this.popup.open('http://someserver.com', ['code']).then(
      function () {
        assert.ok(false, 'resolves the open promise');
      },
      function () {
        assert.ok(false, 'rejected the open promise');
      }
    );

    localStorage.setItem(
      PopupIdSerializer.serialize('invalid'),
      'http://authServer'
    );
    // Need to manually trigger storage event, since it doesn't fire in the current window
    window.dispatchEvent(buildMockStorageEvent('invalid', 'http://authServer'));

    assert.notOk(
      promise.isFulfilled,
      'promise is not fulfulled by invalid data'
    );
    assert.deepEqual(
      localStorage.getItem(PopupIdSerializer.serialize('invalid')),
      'http://authServer',
      "doesn't remove the key from local storage"
    );
  });

  test('open rejects when window closes', function (assert) {
    assert.expect(2);
    let done = assert.async();

    var mockWindow = buildMockWindow();
    window.open = function () {
      assert.ok(true, 'calls window.open');
      return mockWindow;
    };

    this.popup
      .open('some-url', ['code'])
      .then(
        function () {
          assert.ok(false, 'resolved the open promise');
        },
        function () {
          assert.ok(true, 'rejected the open promise');
        }
      )
      .finally(function () {
        done();
      });

    mockWindow.closed = true;
  });

  test('localStorage state is cleaned up when parent window closes', function (assert) {
    assert.expect(2);
    var mockWindow = buildMockWindow();
    window.open = function () {
      assert.ok(true, 'calls window.open');
      return mockWindow;
    };

    this.popup.open('some-url', ['code']).then(
      function () {
        assert.ok(false, 'resolved the open promise');
      },
      function () {
        assert.ok(false, 'rejected the open promise');
      }
    );

    window.onbeforeunload();

    assert.notOk(
      localStorage.getItem(CURRENT_REQUEST_KEY),
      'adds the key to the current request item'
    );
  });
});
