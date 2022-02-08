function createButtonElement(label) {
	const buttonElement = document.createElement("DIV");
	buttonElement.classList.add("button");
	buttonElement.innerText = label;
	return buttonElement
}

const importButton = document.getElementById("import");
importButton.addEventListener("click", () => {
	const fileInput = document.createElement("INPUT");
	fileInput.type = "file";
	fileInput.accept = ".json";
	fileInput.addEventListener("change", () => {
		const importExportMessage = document.getElementById("import_export_message");
		const importExportMessageBody = document.createElement("P");

		function okMessage(message) {
			while(importExportMessage.firstElementChild) importExportMessage.removeChild(importExportMessage.firstElementChild);
			importButton.classList.remove("button_disabled");
			importExportMessage.classList.add("message_ok");
			importExportMessage.classList.remove("message_error");
			importExportMessageBody.innerText = message;
			importExportMessage.appendChild(importExportMessageBody);
			setTimeout(() => {
				importExportMessage.classList.remove("message_ok");
				while(importExportMessage.firstElementChild) importExportMessage.removeChild(importExportMessage.firstElementChild);
			}, 3000);
		}

		function errorMessage(message) {
			while(importExportMessage.firstElementChild) importExportMessage.removeChild(importExportMessage.firstElementChild);
			importButton.classList.remove("button_disabled");
			importExportMessage.classList.remove("message_ok");
			importExportMessage.classList.add("message_error");
			importExportMessageBody.innerText = message;
			importExportMessage.appendChild(importExportMessageBody);
			setTimeout(() => {
				importExportMessage.classList.remove("message_error");
				while(importExportMessage.firstElementChild) importExportMessage.removeChild(importExportMessage.firstElementChild);
			}, 3000);
		}

		importExportMessage.appendChild(importExportMessageBody);
		if(fileInput.value.split(".")[1] == "json") {
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				let readResult;
				try {
					readResult = JSON.parse(reader.result);
					chrome.storage.sync.get(null).then((data) => {
						if(Object.keys(data).length == 0) {
							chrome.storage.sync.set(readResult).then(() => okMessage("データをインポートしました。")).catch(() => errorMessage("データの書き込みに失敗しました。"));
						}
					}).catch(() => errorMessage("データの読み込みに失敗しました。"));
				}
				catch {
					errorMessage("ファイルの読み込みに失敗しました。ファイルの形式が正しくない場合があります。");
				}
				importButton.classList.add("button_disabled");
				importExportMessage.classList.add("message_ok");
				importExportMessage.classList.remove("message_error");
				importExportMessageBody.innerText = "データをインポート方法を選択して下さい。";
				const importReplaceButton = createButtonElement("置き換え");
				importReplaceButton.style.marginRight = "3px";
				importReplaceButton.addEventListener("click", () => {
					chrome.storage.sync.set(readResult).then(() => okMessage("データをインポートしました。")).catch(() => errorMessage("データの書き込みに失敗しました。"));
				});
				importExportMessage.appendChild(importReplaceButton);
				const importAddReplaceDuplicationButton = createButtonElement("追加（重複は置き換え）");
				importAddReplaceDuplicationButton.style.marginRight = "3px";
				importAddReplaceDuplicationButton.addEventListener("click", () => {
					chrome.storage.sync.get(null).then((data) => {
						const achievementsTrackData = data;
						for(let appId in readResult) {
							if(achievementsTrackData[appId]) {
								for(let achievementName in readResult[appId]["achievements"]) achievementsTrackData[appId]["achievements"][achievementName] = readResult[appId]["achievements"][achievementName];
							}
							else achievementsTrackData[appId] = readResult[appId];
						}
						chrome.storage.sync.set(achievementsTrackData).then(() => okMessage("データをインポートしました。")).catch(() => errorMessage("データの書き込みに失敗しました。"));
					}).catch(() => errorMessage("データの読み込みに失敗しました。"));
				});
				importExportMessage.appendChild(importAddReplaceDuplicationButton);
				const importAddButton = createButtonElement("追加");
				importAddButton.addEventListener("click", () => {
					chrome.storage.sync.get(null).then((data) => {
						const achievementsTrackData = data;
						for(let appId in readResult) {
							if(achievementsTrackData[appId]) {
								for(let achievementName in readResult[appId]["achievements"]) {
									if(!achievementsTrackData[appId]["achievements"][achievementName]) achievementsTrackData[appId]["achievements"][achievementName] = readResult[appId]["achievements"][achievementName];
								}
							}
							else achievementsTrackData[appId] = readResult[appId];
						}
						chrome.storage.sync.set(achievementsTrackData).then(() => okMessage("データをインポートしました。")).catch(() => errorMessage("データの書き込みに失敗しました。"));
					}).catch(() => errorMessage("データの読み込みに失敗しました。"));
				});
				importExportMessage.appendChild(importAddButton);
				const importCancelButton = createButtonElement("キャンセル");
				importCancelButton.style.marginTop = "3px";
				importCancelButton.addEventListener("click", () => {
					importButton.classList.remove("button_disabled");
					importExportMessage.classList.remove("message_ok");
					while(importExportMessage.firstElementChild) importExportMessage.removeChild(importExportMessage.firstElementChild);
				});
				importExportMessage.appendChild(importCancelButton);
			});
			reader.readAsText(fileInput.files[0]);
		}
		else errorMessage("このファイルは正しくありません。");
	});
	fileInput.click();
});

document.getElementById("export").addEventListener("click", () => {
	chrome.storage.sync.get(null).then((data) => {
		const blob = new Blob([JSON.stringify(data, null, 4)], { type: "text/plain" });
		const exportElement = document.createElement("A");
		exportElement.href = URL.createObjectURL(blob);
		exportElement.download = "AchievementsData.json";
		exportElement.click();
	});
});

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {
	const clearMessage = document.getElementById("clear_message");
	const clearMessageBody = document.createElement("P");
	clearMessage.appendChild(clearMessageBody);
	clearButton.classList.add("button_disabled");
	clearMessage.classList.add("message_error");
	clearMessageBody.innerText = "実績データを全て削除しますか？この操作は元に戻せません。";
	const clearConfirmButton = createButtonElement("OK");
	clearConfirmButton.style.marginRight = "3px";
	clearConfirmButton.addEventListener("click", () => {
		chrome.storage.sync.clear().then(() => {
			clearButton.classList.remove("button_disabled");
			clearMessage.classList.remove("message_error");
			while(clearMessage.firstElementChild) clearMessage.removeChild(clearMessage.firstElementChild);
			clearMessage.classList.add("message_ok");
			clearMessageBody.innerText = "実績データを削除しました。";
			clearMessage.appendChild(clearMessageBody);
			setTimeout(() => {
				clearMessage.classList.remove("message_ok");
				while(clearMessage.firstElementChild) clearMessage.removeChild(clearMessage.firstElementChild);
			}, 3000);
		});
	});
	clearMessage.appendChild(clearConfirmButton);
	const clearCancelButton = createButtonElement("キャンセル");
	clearCancelButton.addEventListener("click", () => {
		clearButton.classList.remove("button_disabled");
		clearMessage.classList.remove("message_error");
		while(clearMessage.firstElementChild) clearMessage.removeChild(clearMessage.firstElementChild);
	});
	clearMessage.appendChild(clearCancelButton);
});