'use strict';

// triggers on each web request
chrome.webRequest.onBeforeRequest.addListener( function ( details ) {
  // capture initial request if it originates from tabId -1 and a scope is set
  // console.log('webRequest details: ', details);

  var host = '';

  if (details.initiator) {
    host = new URL(details.initiator).hostname || '';
  } else {
    host = new URL(details.url).hostname || '';
  }

  chrome.storage.sync.get(host, (proxySettings) => {
    // console.log('proxySettings: ', proxySettings);
    if (proxySettings[host]) {
      const proxy = proxySettings[host];
      chrome.proxy.settings.set({
        scope: 'regular',
        value: {
          mode: 'fixed_servers',
          rules: {
            proxyForHttp: {
              scheme: 'socks5',
              host: proxy.split(':')[0],
              port: parseInt(proxy.split(':')[1])
            },
            proxyForHttps: {
              scheme: 'socks5',
              host: proxy.split(':')[0],
              port: parseInt(proxy.split(':')[1])
            },
            proxyForFtp: {
              scheme: 'socks5',
              host: proxy.split(':')[0],
              port: parseInt(proxy.split(':')[1])
            },
            fallbackProxy: {
              scheme: 'socks5',
              host: proxy.split(':')[0],
              port: parseInt(proxy.split(':')[1])
            },
          }
        }
      }, () => {
        return { cancel: false }; // allow request
      });

    } else {
      chrome.proxy.settings.clear({ scope: 'regular' }, () => {
        return { cancel: false }; // allow request
      });
    }
  });
}, {urls: ["<all_urls>"]}, ["blocking"]);

