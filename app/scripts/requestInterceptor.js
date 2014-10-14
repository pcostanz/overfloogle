(function(){
  'use strict';

  console.log('initializing request interceptor');

  /**
   * @module requestInterceptor
   *   Injects a script that will modify the XHR open function
   *   and add a dispatchEvent that can be identified by the
   *   application to initialize itself.
   *
   *   References:
   *   http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script/9517879#9517879
   *   https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
   */

  var xhrInterceptorFunction = function() {
    var phoneHome = new CustomEvent('googleSearchQuery', {description: 'Google XHR Intercepted'});
    var oldXHROpen = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function() {
      document.dispatchEvent(phoneHome);
      return oldXHROpen.apply(this, [].slice.call(arguments));
    }
  };

  function injectScript(functionToInject) {
    var injectionCode = '(' + functionToInject + ')();';
    var script = document.createElement('script');

    script.textContent = injectionCode;
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
  }

  injectScript(xhrInterceptorFunction);
})();