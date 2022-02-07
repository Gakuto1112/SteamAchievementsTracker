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
				let newData;
				try {
					newData = JSON.parse(reader.result());
				}
				catch {
					message.classList.remove("message_ok");
					message.classList.add("message_error");
					message.innerHTML = "ファイルの読み込みに失敗しました。ファイルの形式が正しくない場合があります。";
				}
				chrome.storage.sync.get(null).then((data) => {
					const achievementData = data;
					achievementData["achievements"] = newData;
					message.classList.add("message_ok");
					message.classList.remove("message_error");
					message.innerHTML = "データをインポートしました。";		
				});
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