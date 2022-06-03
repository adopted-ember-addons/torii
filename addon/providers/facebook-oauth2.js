import { configurable } from '@adopted-ember-addons/torii/configuration';
import Oauth2 from '@adopted-ember-addons/torii/providers/oauth2-code';
import { computed } from '@ember/object';

export default Oauth2.extend({
  name: 'facebook-oauth2',
  baseUrl: computed('apiVersion', function () {
    if (this.get('apiVersion')) {
      // Facebook API version must be of shape 'vx.x'.
      const FACEBOOK_API_VERSION_REGEX = /^v(\d)\.(\d)$/;

      if (!FACEBOOK_API_VERSION_REGEX.test(this.get('apiVersion'))) {
        throw new Error(`The Facebook API version must be of the shape 'vX.X'`);
      }

      return `https://www.facebook.com/${this.get('apiVersion')}/dialog/oauth`;
    } else {
      return `https://www.facebook.com/dialog/oauth`;
    }
  }),

  // Additional url params that this provider requires
  requiredUrlParams: ['display'],

  responseParams: ['code', 'state'],

  scope: configurable('scope', 'email'),
  apiVersion: configurable('apiVersion', null),

  display: 'popup',
  redirectUri: configurable('redirectUri', function () {
    // A hack that allows redirectUri to be configurable
    // but default to the superclass
    return this._super();
  }),

  open() {
    return this._super().then(function (authData) {
      if (authData.authorizationCode && authData.authorizationCode === '200') {
        // indication that the user hit 'cancel', not 'ok'
        throw new Error('User canceled authorization');
      }

      return authData;
    });
  },
});
