document.getElementById("import").addEventListener("click", () => {
	const fileInput = document.createElement("INPUT");
	fileInput.type = "file";
	fileInput.accept = ".json";
	fileInput.addEventListener("change", () => {
		const importExportMessage = document.getElementById("import_export_message");
		const importExportMessageBody = document.createElement("P");
		importExportMessage.appendChild(importExportMessageBody);
		if(fileInput.value.split(".")[1] == "json") {
			importExportMessage.classList.remove("message_ok");
			importExportMessage.classList.remove("message_error");
			importExportMessageBody.innerText = "データをインポートしています...";
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				try {
					chrome.storage.sync.set(JSON.parse(reader.result)).then(() => {
						importExportMessage.classList.add("message_ok");
						importExportMessage.classList.remove("message_error");
						importExportMessageBody.innerText = "データをインポートしました。";
						setTimeout(() => {
							importExportMessage.classList.remove("message_ok");
							while(importExportMessage.firstElementChild) importExportMessage.removeChild(importExportMessage.firstElementChild);
						}, 3000);
					});
				}
				catch {
					importExportMessage.classList.remove("message_ok");
					importExportMessage.classList.add("message_error");
					importExportMessageBody.innerText = "ファイルの読み込みに失敗しました。ファイルの形式が正しくない場合があります。";
					setTimeout(() => {
						importExportMessage.classList.remove("message_error");
						while(importExportMessage.firstElementChild) importExportMessage.removeChild(importExportMessage.firstElementChild);
					}, 3000);
				}
			});
			reader.readAsText(fileInput.files[0]);
		}
		else {
			importExportMessage.classList.remove("message_ok");
			importExportMessage.classList.add("message_error");
			importExportMessageBody.innerText = "このファイルは正しくありません。";
			setTimeout(() => {
				importExportMessage.classList.remove("message_error");
				while(importExportMessage.firstElementChild) importExportMessage.removeChild(importExportMessage.firstElementChild);
			}, 3000);
		}
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
	const clearConfirmButton = document.createElement("DIV");
	clearConfirmButton.classList.add("button");
	clearConfirmButton.innerText = "OK";
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
	const clearCancelButton = document.createElement("DIV");
	clearCancelButton.classList.add("button");
	clearCancelButton.innerText = "キャンセル";
	clearCancelButton.addEventListener("click", () => {
		clearButton.classList.remove("button_disabled");
		clearMessage.classList.remove("message_error");
		while(clearMessage.firstElementChild) clearMessage.removeChild(clearMessage.firstElementChild);
	});
	clearMessage.appendChild(clearCancelButton);
});