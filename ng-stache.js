(function () {
    'use strict';

    /**
     * Initialize module for dashboard
     * @type {*|module}
     */
    var module = angular.module('ng.stache');


    /**
     * Abstraction of a stache provider (localStache)
     */
    function ObjectStore(container) {
        this.$container = container || {};
        this.available = !!this.$container;
    }

    /**
     * Set the key to the specified value
     * @param key
     * @param value
     * @returns {ObjectStore}
     */
    ObjectStore.prototype.set = function(key, value) {
        if(this.available) {
            this.$container[key] = value;
        }

        return this;
    };

    /**
     * Get the value of the item with the specified key
     * @param key
     * @returns {*}
     */
    ObjectStore.prototype.get = function(key) {
        if(this.available) {
            return this.$container[key];
        }
    };

    /**
     * Does the stache provider have an item with the key specified
     * @param key
     * @returns {boolean|*}
     */
    ObjectStore.prototype.has = function(key) {
        return this.available && this.$container[key] !== undefined;
    };

    /**
     * Remove the item with the key
     * @param key
     * @returns {ObjectStore}
     */
    ObjectStore.prototype.remove = function(key) {
        if(this.available) {
            delete this.$container[key];
        }

        return this;
    };

    /**
     * Clear all items from the store
     * @returns {ObjectStore}
     */
    ObjectStore.prototype.clear = function() {
        if(this.available && this.$container.clear) {
            this.$container.clear();
        }
        else {
            _.each(this.keys(), function(key){
                this.remove(key);
            }, this);
        }

        return this;
    };

    /**
     * Get all the item keys from the store
     * @returns {*}
     */
    ObjectStore.prototype.keys = function() {
        var keys = [];
        if(this.available) {
            keys = _.keys(this.$container);
        }

        return keys;
    };

    /**
     * Returns a function that is used to build an object store
     * @returns {Function}
     */
    function objectStoreFactory() {
        return function(container) {
            return new ObjectStore(container);
        };
    }

    /**
     * Return a function that is used to build stache providers
     * @returns {Function}
     */
    function objectStoreProviderFactory() {
        return function(container) {
            return function provider() {
                /**
                 * Setup provider
                 *
                 * @returns {localStacheProvider.Stache}
                 */
                this.$get = function($objectStoreFactory){
                    return $objectStoreFactory(container);
                };

                this.$get.$inject = ['$objectStoreFactory'];
            };
        };
    }

    /**
     * Utility function to generate a provider
     * @param container
     * @returns {*}
     */
    function generateProvider(container) {
        return objectStoreProviderFactory()(container);
    }

    /**
     * Allows for default stache provider to be dependency injected
     * @param $defaultProvider
     */
    function defaultStacheProvider($defaultProvider) {
        this.$get = $defaultProvider.$get;
    }

    /**
     * Register the providers
     */
    module.factory('$objectStoreFactory', [objectStoreFactory]);
    // local stache provider
    module.provider('$localStache', [generateProvider(window.localStache)]);
    // session stache provider
    module.provider('$sessionStache', [generateProvider(window.sessionStache)]);
    // simple (object) stache provider
    module.provider('$simpleStache', [generateProvider()]);
    //default stache provider (currently localStache)
    module.provider('$stache', ['$localStacheProvider', defaultStacheProvider]);
}());
