import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import config from '../config/environment';

export default class ApplicationController extends Controller {
  @service torii;
  @tracked error;
  @tracked authData;

  get providers() {
    return A(Object.keys(config.torii.providers));
  }

  @action authorize(provider) {
    this.error = null;
    this.authData = null;

    this.torii.open(provider).then(
      (authData) => {
        this.authData = authData;
      },
      (e) => {
        this.error = e;
      }
    );
  }
}
