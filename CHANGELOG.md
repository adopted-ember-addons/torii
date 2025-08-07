# Changelog

## Release (2025-08-07)

* torii 1.0.0 (major)

#### :boom: Breaking Change
* `torii`
  * [#42](https://github.com/adopted-ember-addons/torii/pull/42) Add a dependency on `@ember/string`, require ember-auto-import@v2 ([@jagthedrummer](https://github.com/jagthedrummer))
  * [#43](https://github.com/adopted-ember-addons/torii/pull/43) Update node to current LTS versions, dropping Node < 20 ([@jagthedrummer](https://github.com/jagthedrummer))
  * [#40](https://github.com/adopted-ember-addons/torii/pull/40) Update addon blueprint to 4.8 ([@Gaurav0](https://github.com/Gaurav0))

#### :memo: Documentation
* `torii`
  * [#41](https://github.com/adopted-ember-addons/torii/pull/41) Readme fixes ([@Gaurav0](https://github.com/Gaurav0))

#### :house: Internal
* `torii`
  * [#45](https://github.com/adopted-ember-addons/torii/pull/45) setup release-plan ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#44](https://github.com/adopted-ember-addons/torii/pull/44) Switch from yarn to pnpm@10 ([@jagthedrummer](https://github.com/jagthedrummer))

#### Committers: 3
- Gaurav Munjal ([@Gaurav0](https://github.com/Gaurav0))
- Jeremy Green ([@jagthedrummer](https://github.com/jagthedrummer))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

# 1.0.0-beta.1

1.0.0 focuses on getting torii to work on Ember 3.24, Ember 4.0 and up.

## Changes



## Breaking
- To be compatible with Ember 4.x, all implicit injections are removed. This means that you need to explicitly inject the session service, e.g. in routes.
- The set of dependencies is only compatible with Ember 3.24 and upwards
- The addon is only compatible with modern versions of node, with the same rules applied as Ember itself.

# 0.11.0

Project overhaul to adopt modern convetions and remove deprecated usage.
