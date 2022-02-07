document.getElementById("import").addEventListener("click", () => {
	const fileInput = document.createElement("INPUT");
	fileInput.type = "file";
	fileInput.addEventListener("change", () => {
		const message = document.getElementById("message");
		if(fileInput.value.split(".")[1] == "json") {
			message.classList.remove("message_ok");
			message.classList.remove("message_error");
			message.innerHTML = "データをインポートしています...";
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				try {
					chrome.storage.sync.set(JSON.parse(reader.result)).then(() => {
						message.classList.add("message_ok");
						message.classList.remove("message_error");
						message.innerHTML = "データをインポートしました。";		
					});	
				}
				catch {
					message.classList.remove("message_ok");
					message.classList.add("message_error");
					message.innerHTML = "ファイルの読み込みに失敗しました。ファイルの形式が正しくない場合があります。";
				}
			});
			reader.readAsText(fileInput.files[0]);
		}
		else {
			message.classList.remove("message_ok");
			message.classList.add("message_error");
			message.innerHTML = "このファイルは正しくありません。";
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

document.getElementById("clear").addEventListener("click", () => {
	const clearMessage = document.getElementById("clear_message");
	const clearDoneMessage = document.getElementById("clear_done_message");
	clearDoneMessage.classList.remove("message_ok");
	clearMessage.classList.add("message_error");
	document.getElementById("clear_confirm").addEventListener("click", () => {
		chrome.storage.sync.clear().then(() => {
			clearMessage.classList.remove("message_error");
			clearDoneMessage.classList.add("message_ok");
			setTimeout(() => clearDoneMessage.classList.remove("message_ok"), 3000);
		});
	});
	document.getElementById("clear_cancel").addEventListener("click", () => clearMessage.classList.remove("message_error"));
});