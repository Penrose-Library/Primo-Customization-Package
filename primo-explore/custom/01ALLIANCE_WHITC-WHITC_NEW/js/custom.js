 var _paq = _paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  //_paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var su="https://app.library.whitman.edu/plus/js/";
    _paq.push(['setTrackerUrl', su]);
    _paq.push(['setSiteId', '3']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=su; s.parentNode.insertBefore(g,s);
  })();

(function () {
    "use strict";
    'use strict';

var app = angular.module('viewCustom', ['angularLoad']);

app.component("prmAlmaOtherMembersAfter", {
  bindings: {
    parentCtrl: "<",
  },
  controller: [
    function () {
      var ctrl = this;
      ctrl.parentCtrl.isCollapsed = true;
    },
  ],
});

	/** Bring back the scopes for basic searches plus emergency banner **/
//	app.component('prmSearchBarAfter', {
//		template: '<div class="ebanner hide-xs"><p>For instructions on how to access print materials, see <a href="https://libguides.whitman.edu/c.php?g=1011506&p=7435757">this guide</a>.</p></div>',
//		bindings: {parentCtrl: '<'},
//		controller: 'SearchBarAfterController'
//	});

	app.controller('SearchBarAfterController', ['angularLoad', function (angularLoad) {
	var vm = this;
	vm.parentCtrl.showTabsAndScopes = true;
	}]);

	/** END Bring back the scopes for basic searches **/
//Add Emergency Banner
//app.component('prmSearchBarAfter', {
 // template: '<div class="ebanner"><p>For instructions on how to access print materials, see <a href="https://libguides.whitman.edu/c.php?g=1011506&p=7435757">this guide</a>.</p></div>'
//});

app.component('prmAlmaMoreInstAfter', { template: '<toggle-institutions />' });
app.constant('showHideMoreInstOptions', {
        default_state: "hidden",
        show_label: "Show libraries",
        hide_label: "Hide libraries"
});


//text sms action
var app = angular.module('viewCustom', ['customActions', 'smsAction']);

// end of text sms
app.component('prmActionListAfter', { template: '<sms-action />' });



	// Enhance No Results tile

	app.controller('prmNoSearchResultAfterController', [function () {
		var vm = this;
		vm.getSearchTerm = getSearchTerm;
		function getSearchTerm() {
 			return vm.parentCtrl.term;
 		}
	}]);

	app.component('prmNoSearchResultAfter',{
		bindings: {parentCtrl: '<'},
		controller: 'prmNoSearchResultAfterController',
		template: `<md-card class="default-card zero-margin _md md-primoExplore-theme">
					<md-card-content>
						<p><b><a href="https://sherlock.whitman.edu/primo-explore/search?vid=WHITC_NEW" target="_top">Back to Main Search Page</a></b></p>

						<p><b><a href="https://whitman.on.worldcat.org/discovery">Search WorldCat</a></b></p>
						<p><b><a href="https://library.whitman.edu/contact-a-librarian/">Contact a Librarian for Assistance</a></b></p>
					</md-card-content>
				   </md-card>`
	});

	//Add Ask Librarian Button
	app.component('prmTopBarBefore',{
		template: '<div id="s-la-widget-activator-2815" class="s-la-widget s-la-widget-sidetab s-la-widget-sidetab-right prm-page-nav-menu"><a class="s-la-widget-sidetab-a" href="#" onclick="window.open(\'https://library.whitman.edu/res/primo/widget/ask.html\',\'name\',\'width=600,height=400\'); return false;" target="_blank">Ask Us</a></div>'
	});


	//Analytics
app.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){
  $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl){
	     _paq.push(['setCustomUrl', newUrl]);
		_paq.push(['setReferrerUrl', oldUrl]);
		if (typeof $location.search().search_scope !== 'undefined') {
				_paq.push(['trackEvent', 'search', 'scope', $location.search().search_scope]);
			 }
		_paq.push(['trackPageView']);
	  });
}]);


})();





