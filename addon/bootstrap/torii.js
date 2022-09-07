import LinkedInOauth2Provider from '@adopted-ember-addons/torii/providers/linked-in-oauth2';
import GoogleOauth2Provider from '@adopted-ember-addons/torii/providers/google-oauth2';
import GoogleOauth2BearerProvider from '@adopted-ember-addons/torii/providers/google-oauth2-bearer';
import GoogleOauth2BearerV2Provider from '@adopted-ember-addons/torii/providers/google-oauth2-bearer-v2';
import FacebookConnectProvider from '@adopted-ember-addons/torii/providers/facebook-connect';
import FacebookOauth2Provider from '@adopted-ember-addons/torii/providers/facebook-oauth2';
import ApplicationAdapter from '@adopted-ember-addons/torii/adapters/application';
import TwitterProvider from '@adopted-ember-addons/torii/providers/twitter-oauth1';
import GithubOauth2Provider from '@adopted-ember-addons/torii/providers/github-oauth2';
import AzureAdOauth2Provider from '@adopted-ember-addons/torii/providers/azure-ad-oauth2';
import StripeConnectProvider from '@adopted-ember-addons/torii/providers/stripe-connect';

import ToriiService from '@adopted-ember-addons/torii/services/torii';
import PopupService from '@adopted-ember-addons/torii/services/popup';
import IframeService from '@adopted-ember-addons/torii/services/iframe';

export default function (application) {
  application.register('service:torii', ToriiService);

  application.register(
    'torii-provider:linked-in-oauth2',
    LinkedInOauth2Provider
  );
  application.register('torii-provider:google-oauth2', GoogleOauth2Provider);
  application.register(
    'torii-provider:google-oauth2-bearer',
    GoogleOauth2BearerProvider
  );
  application.register(
    'torii-provider:google-oauth2-bearer-v2',
    GoogleOauth2BearerV2Provider
  );
  application.register(
    'torii-provider:facebook-connect',
    FacebookConnectProvider
  );
  application.register(
    'torii-provider:facebook-oauth2',
    FacebookOauth2Provider
  );
  application.register('torii-provider:twitter', TwitterProvider);
  application.register('torii-provider:github-oauth2', GithubOauth2Provider);
  application.register('torii-provider:azure-ad-oauth2', AzureAdOauth2Provider);
  application.register('torii-provider:stripe-connect', StripeConnectProvider);
  application.register('torii-adapter:application', ApplicationAdapter);

  application.register('torii-service:iframe', IframeService);
  application.register('torii-service:popup', PopupService);
}
