/* eslint-disable ember/new-module-imports */

import Ember from 'ember';
import bootstrapRouting from '@adopted-ember-addons/torii/bootstrap/routing';
import { getConfiguration } from '@adopted-ember-addons/torii/configuration';
import getRouterInstance from '@adopted-ember-addons/torii/compat/get-router-instance';
import getRouterLib from '@adopted-ember-addons/torii/compat/get-router-lib';
import '@adopted-ember-addons/torii/router-dsl-ext';

export default {
  name: 'torii-setup-routes',
  initialize(applicationInstance /*, registry */) {
    const configuration = getConfiguration();

    if (!configuration.sessionServiceName) {
      return;
    }

    let _router = getRouterInstance(applicationInstance);
    const router = applicationInstance.lookup('service:router');

    var setupRoutes = function () {
      let routerLib = getRouterLib(_router);
      var authenticatedRoutes = routerLib.authenticatedRoutes;
      var hasAuthenticatedRoutes = !Ember.isEmpty(authenticatedRoutes);
      if (hasAuthenticatedRoutes) {
        bootstrapRouting(applicationInstance, authenticatedRoutes);
      }

      router.off('routeWillChange', setupRoutes);
    };

    router.on('routeWillChange', setupRoutes);
  },
};
