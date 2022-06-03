import { inject as service } from '@ember/service';
import Component from '@ember/component'; //eslint-disable-line
import Controller from '@ember/controller';
import configuration from '../../config/environment';
import { module, test } from 'qunit';
import {
  setupContext,
  teardownContext,
  setupApplicationContext,
  setApplication,
} from '@ember/test-helpers';
import Application from 'dummy/app';

let toriiConfiguration = configuration.torii;
var originalSessionServiceName;

module('Acceptance | Ember Initialization', function (hooks) {
  hooks.beforeEach(function () {
    setApplication(Application.create(configuration.APP));
    originalSessionServiceName = toriiConfiguration.sessionServiceName;
    delete toriiConfiguration.sessionServiceName;
  });

  hooks.afterEach(async function () {
    toriiConfiguration.sessionServiceName = originalSessionServiceName;
    await teardownContext(this);
  });

  test('session is not injected by default', async function (assert) {
    await setupContext(this, {});
    await setupApplicationContext(this);

    assert.equal(this.owner.lookup('service:session'), null);

    class AppCon extends Controller {}

    this.owner.register('controller:application', AppCon);
    const controller = this.owner.lookup('controller:application');
    assert.equal(controller.session, null, 'controller has no session');
  });

  test('session is injected with the name in the configuration', async function (assert) {
    toriiConfiguration.sessionServiceName = 'wackySessionName';
    await setupContext(this);
    await setupApplicationContext(this);

    assert.notEqual(this.owner.lookup('service:wackySessionName'), null);

    class AppCon extends Controller {}

    this.owner.register('controller:application', AppCon);

    const controller = this.owner.lookup('controller:application');
    assert.ok(controller.wackySessionName);
    assert.equal(controller.session, null);
  });

  test('session is injectable using inject.service', async function (assert) {
    toriiConfiguration.sessionServiceName = 'session';

    await setupContext(this, {});
    await setupApplicationContext(this);

    class TestComponent extends Component {
      @service session;
      @service torii;
    }

    assert.notEqual(
      this.owner.lookup('service:session'),
      null,
      'Session is injected into app'
    );

    this.owner.register('component:testComponent', TestComponent);
    var DummyRenderer = { componentInitAttrs() {} };

    var component = this.owner
      .factoryFor('component:testComponent')
      .create({ renderer: DummyRenderer });

    assert.ok(
      component.get('session'),
      'Component has access to injected session service'
    );
    assert.ok(
      component.get('torii'),
      'Component has access to injected torii service'
    );
  });
});
