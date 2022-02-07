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