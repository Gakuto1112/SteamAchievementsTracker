chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.get(null).then((data) => {
		const userData = data;
		if(Object.keys(data).length == 0) {
			userData["settings"] = {};
			userData["settings"]["mode"] = "sync";
			userData["achievements"] = {};
			chrome.storage.sync.set(userData);
		}
	});
});