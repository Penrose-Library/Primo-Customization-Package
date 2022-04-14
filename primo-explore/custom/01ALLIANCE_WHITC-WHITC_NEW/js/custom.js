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


var app = angular.module('viewCustom', ['customActions','toggleInstitutions']);


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
angular.module('customActions', []);

/* eslint-disable max-len */
angular.module('customActions').component('customAction', {
  bindings: {
    name: '@',
    label: '@',
    icon: '@',
    iconSet: '@',
    link: '@',
    index: '<'
  },
  require: {
    prmActionCtrl: '^prmActionList'
  },
  controller: ['customActions', function (customActions) {
    var _this = this;

    this.$onInit = function () {
      _this.action = {
        name: _this.name,
        label: _this.label,
        index: _this.index,
        icon: {
          icon: _this.icon,
          iconSet: _this.iconSet,
          type: 'svg'
        },
        onToggle: customActions.processLinkTemplate(_this.link, _this.prmActionCtrl.item)
      };
      customActions.addAction(_this.action, _this.prmActionCtrl);
    };
    this.$onDestroy = function () {
      return customActions.removeAction(_this.action, _this.prmActionCtrl);
    };
  }]
});

/* eslint-disable max-len */
angular.module('customActions').factory('customActions', function () {
  return {
    /**
     * Adds an action to the actions menu, including its icon.
     * @param  {object} action  action object
     * @param  {object} ctrl    instance of prmActionCtrl
     */
    // TODO coerce action.index to be <= requiredActionsList.length
    addAction: function addAction(action, ctrl) {
      if (!this.actionExists(action, ctrl)) {
        this.addActionIcon(action, ctrl);
        ctrl.actionListService.requiredActionsList.splice(action.index, 0, action.name);
        ctrl.actionListService.actionsToIndex[action.name] = action.index;
        ctrl.actionListService.onToggle[action.name] = action.onToggle;
        ctrl.actionListService.actionsToDisplay.unshift(action.name);
      }
    },
    /**
     * Removes an action from the actions menu, including its icon.
     * @param  {object} action  action object
     * @param  {object} ctrl    instance of prmActionCtrl
     */
    removeAction: function removeAction(action, ctrl) {
      if (this.actionExists(action, ctrl)) {
        this.removeActionIcon(action, ctrl);
        delete ctrl.actionListService.actionsToIndex[action.name];
        delete ctrl.actionListService.onToggle[action.name];
        var i = ctrl.actionListService.actionsToDisplay.indexOf(action.name);
        ctrl.actionListService.actionsToDisplay.splice(i, 1);
        i = ctrl.actionListService.requiredActionsList.indexOf(action.name);
        ctrl.actionListService.requiredActionsList.splice(i, 1);
      }
    },
    /**
     * Registers an action's icon.
     * Called internally by addAction().
     * @param  {object} action  action object
     * @param  {object} ctrl    instance of prmActionCtrl
     */
    addActionIcon: function addActionIcon(action, ctrl) {
      ctrl.actionLabelNamesMap[action.name] = action.label;
      ctrl.actionIconNamesMap[action.name] = action.name;
      ctrl.actionIcons[action.name] = action.icon;
    },
    /**
     * Deregisters an action's icon.
     * Called internally by removeAction().
     * @param  {object} action  action object
     * @param  {object} ctrl    instance of prmActionCtrl
     */
    removeActionIcon: function removeActionIcon(action, ctrl) {
      delete ctrl.actionLabelNamesMap[action.name];
      delete ctrl.actionIconNamesMap[action.name];
      delete ctrl.actionIcons[action.name];
    },
    /**
     * Check if an action exists.
     * Returns true if action is part of actionsToIndex.
     * @param  {object} action  action object
     * @param  {object} ctrl    instance of prmActionCtrl
     * @return {bool}
     */
    actionExists: function actionExists(action, ctrl) {
      return ctrl.actionListService.actionsToIndex.hasOwnProperty(action.name);
    },
    /**
     * Process a link into a function to call when the action is clicked.
     * The function will open the processed link in a new tab.
     * Will replace {pnx.xxx.xxx} expressions with properties from the item.
     * @param  {string}    link    the original link string from the html
     * @param  {object}    item    the item object obtained from the controller
     * @return {function}          function to call when the action is clicked
     */
    processLinkTemplate: function processLinkTemplate(link, item) {
      var processedLink = link;
      var pnxProperties = link.match(/\{(pnx\..*?)\}/g) || [];
      pnxProperties.forEach(function (property) {
        var value = property.replace(/[{}]/g, '').split('.').reduce(function (o, i) {
          try {
            var h = /(.*)(\[\d\])/.exec(i);
            if (h instanceof Array) {
              return o[h[1]][h[2].replace(/[^\d]/g, '')];
            }
            return o[i];
          } catch (e) {
            return '';
          }
        }, item);
        processedLink = processedLink.replace(property, value);
      });
      return function () {
        return window.open(processedLink, '_blank','toolbar=no, location=no, status=no, menubar=no,scrollbars=yes,resizable=yes, width=420,height=200');
      };
    }
  };
});



//include custom action for SMS
	
	 
app.component('prmActionListAfter', {
bindings: {parentCtrl: '<'},
 controller: function($scope){
               var vm = this;
			  // console.log($scope);
			   vm.availlibrary = vm.parentCtrl.item.pnx.display.availlibrary;
			   vm.availstring = encodeURIComponent(JSON.stringify(vm.availlibrary));
                },
  template: '<custom-action name="send_sms" label="Send to Phone" index=2 icon="ic_textsms_24px" icon-set="communication" link="https://library.whitman.edu/php/apps/sms_sherlock/send_newui.php?pnx={pnx.control.recordid[0]}&type={pnx.display.type[0]}&title={pnx.display.title[0]}&lds04={pnx.display.lds04}&lds08={pnx.display.lds08[0]}&availability={{$ctrl.availstring}}" />'
});


	

// end of text sms




	
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





