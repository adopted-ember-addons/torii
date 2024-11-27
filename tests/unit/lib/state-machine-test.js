/* eslint-disable qunit/no-negated-ok */
import StateMachine from 'torii/lib/state-machine';
import { module, test } from 'qunit';

module('Unit | Lib | State Machine', function (/*hooks*/) {
  test('can transition from one state to another', function (assert) {
    var sm = new StateMachine({
      initialState: 'initial',
      states: {
        initial: {
          foo: 'bar',
        },
        started: {
          baz: 'blah',
        },
      },
    });

    assert.strictEqual(sm.currentStateName, 'initial');
    assert.strictEqual(sm.state.foo, 'bar');
    assert.ok(!sm.state.baz, 'has no baz state when initial');

    sm.transitionTo('started');
    assert.strictEqual(sm.currentStateName, 'started');
    assert.strictEqual(sm.state.baz, 'blah');
    assert.ok(!sm.state.foo, 'has no foo state when started');
  });
});
