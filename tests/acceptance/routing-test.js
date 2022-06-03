// import Route from '@ember/routing/route';
// import { run } from '@ember/runloop';
// import rawConfig from '../../config/environment';
// import lookup from '../helpers/lookup';
// import Router from 'dummy/router';
// import { module, test } from 'qunit';
// import {
//   setupContext,
//   teardownContext,
//   setupApplicationContext,
//   setApplication,
// } from '@ember/test-helpers';
// import Application from 'dummy/app';

// let configuration = rawConfig.torii;
// var app, originalSessionServiceName;

// module('Acceptance | Routing', function (hooks) {
//   hooks.beforeEach(function () {
//     originalSessionServiceName = configuration.sessionServiceName;
//     delete configuration.sessionServiceName;
//   });

//   hooks.afterEach(async function () {
//     console.log('FFFFF');
//     configuration.sessionServiceName = originalSessionServiceName;
//     await teardownContext(this);
//   });

//   test('ApplicationRoute#checkLogin is not called when no authenticated routes are present', async function (assert) {
//     assert.expect(2);
//     configuration.sessionServiceName = 'session';

//     var routesConfigured = false;
//     var checkLoginCalled = false;

//     class TestRoute extends Route {
//       checkLogin() {
//         checkLoginCalled = true;
//       }
//     }

//     function map() {
//       console.log('MAP CALLED');
//       routesConfigured = true;
//     }

//     // class AppRouter extends Router {
//     //   location = rawConfig.locationType;
//     //   rootURL = rawConfig.rootURL;
//     //   dingleHopper = 'whey';
//     // }
//     // AppRouter.map(function () {
//     //   routesConfigured = true;
//     // });

//     const fullConfig = Object.assign({}, rawConfig.APP, {
//       Router: AppRouter,
//       loadInitializers: true,
//     });
//     console.log(fullConfig);

//     await setApplication(Application.create(fullConfig));
//     await setupContext(this);
//     await setupApplicationContext(this);

//     console.log(this.owner);

//     console.log(this.owner.lookup('service:router'));

//     console.log('HERE', this, this.owner);
//     this.owner.register('route:application', TestRoute);
//     console.log('HERE', this, this.owner);
//     var applicationRoute = this.owner.lookup('route:application');
//     applicationRoute.beforeModel();

//     // await bootApp(this, {
//     //   map() {
//     //     routesConfigured = true;
//     //   },
//     //   setup() {
//     //     this.owner.register('route:application', TestRoute);
//     //   },
//     // });
//     console.log('AFTER BOOT', this.owner.lookup('router:main'));

//     assert.ok(routesConfigured, 'Router map was called');
//     assert.equal(checkLoginCalled, null, 'checkLogin was not called');
//   });

//   // test('ApplicationRoute#checkLogin is called when an authenticated route is present', function (assert) {
//   //   assert.expect(2);
//   //   configuration.sessionServiceName = 'session';

//   //   var routesConfigured = false;
//   //   var checkLoginCalled = false;

//   //   bootApp({
//   //     map() {
//   //       routesConfigured = true;
//   //       this.authenticatedRoute('account');
//   //     },
//   //     setup() {
//   //       app.register('route:application', Route.extend());
//   //       app.register('route:account', Route.extend());
//   //     },
//   //   });
//   //   var applicationRoute = lookup(app, 'route:application');
//   //   applicationRoute.reopen({
//   //     checkLogin() {
//   //       checkLoginCalled = true;
//   //     },
//   //   });
//   //   var router = lookup(app, 'router:main');
//   //   router.location.setURL('/');
//   //   applicationRoute.beforeModel();
//   //   assert.ok(routesConfigured, 'Router map was called');
//   //   assert.ok(checkLoginCalled, 'checkLogin was called');
//   // });

//   // test('ApplicationRoute#checkLogin returns the correct name of the session variable when an authenticated route is present', function (assert) {
//   //   assert.expect(2);
//   //   configuration.sessionServiceName = 'testName';
//   //   var routesConfigured = false,
//   //     sessionFound = false;

//   //   bootApp({
//   //     map() {
//   //       routesConfigured = true;
//   //       this.authenticatedRoute('account');
//   //     },
//   //     setup() {
//   //       app.register('route:application', Route.extend());
//   //       app.register('route:account', Route.extend());
//   //     },
//   //   });
//   //   var applicationRoute = lookup(app, 'route:application');
//   //   applicationRoute.reopen({
//   //     checkLogin() {
//   //       sessionFound = this.get('testName');
//   //     },
//   //   });
//   //   var router = lookup(app, 'router:main');
//   //   router.location.setURL('/');
//   //   applicationRoute.beforeModel();
//   //   assert.ok(routesConfigured, 'Router map was called');
//   //   assert.ok(sessionFound, 'session was found with custom name');
//   // });

//   // test('authenticated routes get authenticate method', function (assert) {
//   //   assert.expect(2);
//   //   configuration.sessionServiceName = 'session';

//   //   bootApp({
//   //     map() {
//   //       this.route('home');
//   //       this.authenticatedRoute('account');
//   //     },
//   //     setup() {
//   //       app.register('route:application', Route.extend());
//   //       app.register('route:account', Route.extend());
//   //       app.register('route:home', Route.extend());
//   //     },
//   //   });
//   //   var authenticatedRoute = lookup(app, 'route:account');
//   //   var unauthenticatedRoute = lookup(app, 'route:home');

//   //   assert.ok(
//   //     authenticatedRoute.authenticate,
//   //     'authenticate function is present'
//   //   );
//   //   assert.ok(
//   //     !unauthenticatedRoute.authenticate,
//   //     'authenticate function is not present'
//   //   );
//   // });

//   // test('lazily created authenticated routes get authenticate method', function (assert) {
//   //   assert.expect(2);
//   //   configuration.sessionServiceName = 'session';

//   //   bootApp({
//   //     map() {
//   //       this.route('home');
//   //       this.authenticatedRoute('account');
//   //     },
//   //   });
//   //   var applicationRoute = lookup(app, 'route:application');
//   //   var authenticatedRoute = lookup(app, 'route:account');

//   //   assert.ok(applicationRoute.checkLogin, 'checkLogin function is present');
//   //   assert.ok(
//   //     authenticatedRoute.authenticate,
//   //     'authenticate function is present'
//   //   );
//   // });

//   // test('session.attemptedTransition is set before redirecting away from authenticated route', function (assert) {
//   //   var done = assert.async();
//   //   assert.expect(1);

//   //   configuration.sessionServiceName = 'session';
//   //   var attemptedTransition = null;

//   //   bootApp({
//   //     map() {
//   //       this.route('public');
//   //       this.authenticatedRoute('secret');
//   //     },
//   //     setup() {
//   //       app.register('route:application', Route.extend());
//   //       app.register('route:secret', Route.extend());
//   //     },
//   //   });

//   //   var applicationRoute = lookup(app, 'route:application');
//   //   applicationRoute.reopen({
//   //     actions: {
//   //       accessDenied() {
//   //         attemptedTransition = this.get('session').attemptedTransition;
//   //       },
//   //     },
//   //   });

//   //   visit('/secret').then(function () {
//   //     assert.ok(!!attemptedTransition, 'attemptedTransition was set');
//   //     done();
//   //   });
//   // });
// });

// // async function bootApp(ctx, attrs) {
// //   console.log('BEFORE', ctx);
// //   var map = attrs.map || function () {};
// //   var setup = attrs.setup || function () {};

// //   var appRouter = Router.extend();

// //   appRouter.map(map);

// //   const config = Object.assign({}, configuration.APP, {
// //     loadInitializers: true,
// //     Router: Router,
// //   });
// //   setApplication(Application.create(config));

// //   await setupContext(ctx);
// //   console.log('WHAT');
// //   setup.call(ctx);
// //   await setupApplicationContext(ctx);
// //   console.log('AFTER', ctx);
// // }
