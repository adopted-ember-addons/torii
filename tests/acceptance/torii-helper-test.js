import { stubValidSession } from '../helpers/torii';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | Testing Helper', function (hooks) {
  setupApplicationTest(hooks);

  test('sessions are not authenticated by default', function (assert) {
    let session = this.owner.lookup('service:session');
    assert.notOk(
      session.get('isAuthenticated'),
      'session is not authenticated'
    );
  });

  test('#stubValidSession should stub a session that isAuthenticated', function (assert) {
    stubValidSession(this.owner, { id: 42 });
    let session = this.owner.lookup('service:session');
    assert.ok(session.get('isAuthenticated'), 'session is authenticated');
  });

  test('#stubValidSession should stub a session with the userData supplied', function (assert) {
    stubValidSession(this.owner, { id: 42 });
    let session = this.owner.lookup('service:session');
    assert.equal(
      session.get('id'),
      42,
      'session contains the correct currentUser'
    );
  });
});
