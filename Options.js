const syncRadioButton = document.getElementById("save_location_sync");
const localRadioButton = document.getElementById("save_location_local");

function modeRadioButton() {
	//保存モード選択のラジオボタンを変更した時
	const syncLabel = document.getElementById("save_location_sync_label");
	const localLabel = document.getElementById("save_location_local_label");
	const usedByte = document.getElementById("used_byte");
	const allByte = document.getElementById("all_byte");
	const progressBar = document.getElementById("used_bar");

	function setByte(used, all) {
		//バイト数を設定
		usedByte.innerText = used.toLocaleString();
		allByte.innerText = all.toLocaleString();
		progressBar.setAttribute("max", all);
		progressBar.setAttribute("value", used);
	}

	function setMode(mode) {
		chrome.storage.sync.get("settings").then((data) => {
			const userData = data;
			switch(mode) {
				case "sync":
					userData["settings"]["mode"] = "sync";
					break;
				case "local":
					userData["settings"]["mode"] = "local";
					break;
			}
			chrome.storage.sync.set(userData);
		});
	}

	usedByte.innerText = "---";
	allByte.innerText = "---";
	progressBar.removeAttribute("max");
	progressBar.removeAttribute("value");
	if(syncRadioButton.checked) {
		syncLabel.classList.add("bold");
		localLabel.classList.remove("bold");
		setMode("sync");
		chrome.storage.sync.getBytesInUse().then((bytesInUse) => setByte(bytesInUse, chrome.storage.sync.QUOTA_BYTES));
	}
	else {
		syncLabel.classList.remove("bold");
		localLabel.classList.add("bold");
		setMode("local");
		chrome.storage.local.getBytesInUse().then((bytesInUse) => setByte(bytesInUse, chrome.storage.local.QUOTA_BYTES));
	}
}

syncRadioButton.addEventListener("change", () => modeRadioButton());
localRadioButton.addEventListener("change", () => modeRadioButton());
chrome.storage.sync.get("settings").then((data) => {
	switch(data["settings"]["mode"]) {
		case "sync":
			syncRadioButton.checked = true;
			break;
		case "local":
			localRadioButton.checked = true;
			break;
	}
	modeRadioButton();
});