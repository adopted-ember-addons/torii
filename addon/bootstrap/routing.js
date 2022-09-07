import ApplicationRouteMixin from '@adopted-ember-addons/torii/routing/application-route-mixin';
import AuthenticatedRouteMixin from '@adopted-ember-addons/torii/routing/authenticated-route-mixin';
import { lookup, lookupFactory, register } from '@adopted-ember-addons/torii/lib/container-utils';

var AuthenticatedRoute = null;

function reopenOrRegister(applicationInstance, factoryName, mixin) {
  const factory = lookup(applicationInstance, factoryName);

  if (factory) {
    factory.reopen(mixin);
  } else {
    const basicFactory = lookupFactory(applicationInstance, 'route:basic');

    if (!AuthenticatedRoute) {
      AuthenticatedRoute = basicFactory.extend(AuthenticatedRouteMixin);
    }

    register(applicationInstance, factoryName, AuthenticatedRoute);
  }
}

export default function toriiBootstrapRouting(
  applicationInstance,
  authenticatedRoutes
) {
  reopenOrRegister(
    applicationInstance,
    'route:application',
    ApplicationRouteMixin
  );
  for (var i = 0; i < authenticatedRoutes.length; i++) {
    var routeName = authenticatedRoutes[i];
    var factoryName = 'route:' + routeName;
    reopenOrRegister(applicationInstance, factoryName, AuthenticatedRouteMixin);
  }
}
