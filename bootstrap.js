const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import('resource://gre/modules/Services.jsm');

var stringBundle = Services.strings.createBundle('chrome://l10n/locale/global.properties?' + Math.random()); // Randomize URI to work around bug 719376

function startup(aData, aReason) {
	// see here for aReason messages: https://gist.github.com/Noitidart/9025999#comment-1120821
	if (aReason == ADDON_INSTALL || aReason == ADDON_UPGRADE || aReason == ADDON_DOWNGRADE) {
		var currentUrl = Services.prefs.getCharPref('browser.newtab.url');
		
		Services.prompt.alert(null, stringBundle.GetStringFromName('confirm_pref_init'), stringBundle.formatStringFromName('install_msg', [currentUrl], 1));
		//store what it was on install
		Services.prefs.setCharPref('extension.my-addon-id.newtab-url-pre-install', currentUrl);
		
		//set it to what we want to:
		Services.prefs.setCharPref('browser.newtab.url', 'data:text/html,Mozilla Firefox!!!!');
	}
}
function shutdown(aData, aReason) {
	// see here for aReason messages: https://gist.github.com/Noitidart/9025999#comment-1120821
	Services.prompt.alert(null, 'debug msg', 'entered shutdown procedure, the aReaosn is:' + aReason + ' test equality to ADDON_UNINSTALL, answering question is it real uninstall? ::: ' + aReason);
	if (aReason == ADDON_DISABLE) { // we have to do this in shutdown, instead of uninstall because during unisntall the localization file is not available
		// real uninstall, this uninstall gets trigged on addon_upgrade/addon_downgrade as well thats why we have to do this test
		//have to reimport stringBunlde during uninstall:
		//stringBundle = Services.strings.createBundle('chrome://l10n/locale/global.properties?' + Math.random()); // Randomize URI to work around bug 719376
		var currentUrl = Services.prefs.getCharPref('browser.newtab.url');
		var preInstallUrl = Services.prefs.getCharPref('extension.my-addon-id.newtab-url-pre-install');
		var result = Services.prompt.confirm(null, stringBundle.GetStringFromName('confirm_pref_reset'), stringBundle.formatStringFromName('uninstall_msg', [currentUrl, preInstallUrl], 2));
		if (result == true) {
			Services.prefs.setCharPref('browser.newtab.url', preInstallUrl);
		}
		// lets delete our pref
		Services.prefs.clearUserPref('extension.my-addon-id.newtab-url-pre-install'); // this will delete the pref as we never set a default for ttis preference
	}
}

function install() {}
 
function uninstall() {
	// to trigger uninstall of bootstrap addon: go to addon manager, click "remove" on your addon. then close addon manager, this triggers the uninstall
}
