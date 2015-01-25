const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import('resource://gre/modules/Services.jsm');

var stringBundle = Services.strings.createBundle('chrome://l10n/locale/global.properties?' + Math.random()); // Randomize URI to work around bug 719376

function install(aData, aReason) {
	if (aReason == ADDON_INSTALL || aReason == ADDON_UPGRADE || aReason == ADDON_DOWNGRADE) {
		var currentUrl = Services.prefs.getCharPref('browser.newtab.url');
		var result = Services.prompt.alert(null, stringBundle.GetStringFromName('confirm_pref_init'), stringBundle.formatStringFromName('install_msg', [currentUrl], 1));
		//store what it was on install
		Services.prefs.setCharPref('extension.my-addon-id.newtab-url-pre-install', currentUrl);
		
		//set it to what we want to:
		Services.prefs.setCharPref('browser.newtab.url', 'data:text/html,Mozilla Firefox!!!!');
	}
}
function uninstall(aData, aReason) {
	if (aReason == ADDON_UNINSTALL) {
		// real uninstall, this uninstall gets trigged on addon_upgrade/addon_downgrade as well thats why we have to do this test
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

function startup() {
	Services.prompt.alert(null, stringBundle.GetStringFromName('startup_prompt_title'), stringBundle.GetStringFromName('startup_prompt_message'));
}
 
function shutdown() {}
