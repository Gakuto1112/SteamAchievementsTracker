document.getElementById("steam_link").addEventListener("click", () => chrome.tabs.create({ url: "https://store.steampowered.com/" }));
chrome.storage.local.get(null, (achievementsData) => {
	let achievementFound = false;
	for(let appId in achievementsData) {
		for(let achievementName in achievementsData[appId]["achievements"]) {
			if(achievementsData[appId]["achievements"][achievementName]["vote"] == 1) {
				Object.keys(achievementsData).forEach((appId, index) => {
					if(index == 0) document.getElementById("message").innerText = "現在追跡中の実績は以下の通りです。これらの実績の取得に向けて頑張ってプレイしましょう！追跡中の実績を獲得した場合、そのゲームの実績ページにアクセスすると、追跡リストから削除されます。";
					const gameBlock = document.createElement("DIV");
					gameBlock.classList.add("game_block");
					const gameTitle = document.createElement("DIV");
					gameTitle.classList.add("game_title");
					const gameTitleText = document.createElement("H2");
					gameTitleText.innerText = achievementsData[appId]["name"];
					gameTitleText.addEventListener("click", () => chrome.tabs.create({ url: achievementsData[appId]["pageUrl"] }));
					gameTitle.appendChild(gameTitleText);
					const gameImage = document.createElement("IMG");
					gameImage.classList.add("game_image");
					gameImage.src = achievementsData[appId]["imageUrl"];
					gameTitle.appendChild(gameImage);
					gameBlock.appendChild(gameTitle);
					const achievementsList = document.createElement("DIV");
					achievementsList.classList.add("achievements_list");
					Object.keys(achievementsData[appId]["achievements"]).forEach((achievementName) => {
						if(achievementsData[appId]["achievements"][achievementName]["vote"] == 1) {
							const achievementRow = document.createElement("DIV");
							achievementRow.classList.add("achievement_row");
							const achievementImage = document.createElement("IMG");
							achievementImage.classList.add("achievement_image");
							achievementImage.src = achievementsData[appId]["achievements"][achievementName]["imageUrl"];
							achievementRow.appendChild(achievementImage);
							const achievementTextHolder = document.createElement("DIV");
							achievementTextHolder.classList.add("achievement_text_holder");
							const achievementText = document.createElement("DIV");
							achievementText.classList.add("achievement_text");
							const achievementTitle = document.createElement("H3");
							achievementTitle.innerText = achievementName;
							achievementText.appendChild(achievementTitle);
							const achievementDescription = document.createElement("P");
							achievementDescription.classList.add("achievement_description");
							achievementDescription.innerText = achievementsData[appId]["achievements"][achievementName]["description"];
							achievementText.appendChild(achievementDescription);
							achievementTextHolder.appendChild(achievementText);
							achievementRow.appendChild(achievementTextHolder);
							achievementsList.appendChild(achievementRow);
							gameBlock.appendChild(achievementsList);
						}
					});
					document.getElementById("achievements_column").appendChild(gameBlock);
				});
				achievementFound = true;
				break;			
			}
		}
		if(achievementFound) break;
	}
});