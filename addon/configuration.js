/* eslint-disable ember/require-computed-property-dependencies, ember/no-side-effects, ember/no-get */
import { get, computed } from '@ember/object';

const NAMESPACE = 'providers';
let configuration = {};

const getValue = function (configKey) {
  const configNamespace = NAMESPACE + '.' + this.get('name');
  const propertyPath = configNamespace + '.' + configKey;
  const configuration = getConfiguration();
  return get(configuration, propertyPath);
};

function configurable(configKey, defaultValue) {
  // want to somehow determine if should return legacy or new decorator
  return configurableLegacy(configKey, defaultValue);
}

function configurableDecorator(configKey, defaultValue) {
  return function (_target, _key, descriptor) {
    const originalGetter = descriptor.get;
    const getter = function () {
      const value = getValue.call(this, configKey);

      if (typeof value === 'undefined') {
        if (typeof defaultValue !== 'undefined') {
          if (typeof defaultValue === 'function') {
            return defaultValue.call(this);
          } else {
            return defaultValue;
          }
        } else if (typeof originalGetter === 'function') {
          return originalGetter.call(this);
        } else {
          throw new Error(
            `Expected configuration value ${configKey} to be defined for provider named ${this.name}`
          );
        }
      }

      return value;
    };

    return {
      get: getter,
      enumerable: false,
      configurable: true,
    };
  };
}

function configurableLegacy(configKey, defaultValue) {
  return computed(function configurableComputed() {
    const value = getValue.call(this, configKey);
    if (typeof value === 'undefined') {
      if (typeof defaultValue !== 'undefined') {
        if (typeof defaultValue === 'function') {
          return defaultValue.call(this);
        } else {
          return defaultValue;
        }
      } else {
        throw new Error(
          'Expected configuration value ' +
            configKey +
            ' to be defined for provider named ' +
            this.get('name')
        );
      }
    }
    return value;
  });
}

function configure(settings) {
  configuration = settings;
}

function getConfiguration() {
  return configuration;
}

export {
  configurable,
  configurableLegacy,
  configurableDecorator,
  configure,
  getConfiguration,
};

export default {};
