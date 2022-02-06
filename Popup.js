function steamLink() {
	//Steamへのリンクを追加
	document.getElementById("steam_link").addEventListener("click", () => chrome.tabs.create({ url: "https://store.steampowered.com/" }));
}

steamLink();
chrome.storage.local.get(null, (data) => {
	const achievementsTrackData = data;
	let achievementFound = false;
	let messageInit = true;
	for(let appId in achievementsTrackData) {
		for(let achievementName in achievementsTrackData[appId]["achievements"]) {
			if(achievementsTrackData[appId]["achievements"][achievementName]["vote"] == 1) {
				const message = document.getElementById("message");
				const achievementsColumn = document.getElementById("achievements_column");

				if(messageInit) {
					message.innerText = "現在追跡中の実績は以下の通りです。これらの実績の取得に向けて頑張ってプレイしましょう！追跡中の実績を獲得した場合、そのゲームの実績ページにアクセスすると、追跡リストから削除されます。";
					messageInit = false;
				}
				const gameBlock = document.createElement("DIV");
				gameBlock.classList.add("game_block");
				const gameTitle = document.createElement("DIV");
				gameTitle.classList.add("game_title");
				const gameTitleText = document.createElement("H2");
				gameTitleText.innerText = achievementsTrackData[appId]["name"];
				gameTitleText.addEventListener("click", () => chrome.tabs.create({ url: achievementsTrackData[appId]["pageUrl"] }));
				gameTitle.appendChild(gameTitleText);
				const gameImage = document.createElement("IMG");
				gameImage.classList.add("game_image");
				gameImage.src = achievementsTrackData[appId]["imageUrl"];
				gameTitle.appendChild(gameImage);
				gameBlock.appendChild(gameTitle);
				const achievementsList = document.createElement("DIV");
				achievementsList.classList.add("achievements_list");
				Object.keys(achievementsTrackData[appId]["achievements"]).forEach((achievementName) => {
					if(achievementsTrackData[appId]["achievements"][achievementName]["vote"] == 1) {
						const achievementRow = document.createElement("DIV");
						achievementRow.classList.add("achievement_row");
						const achievementImage = document.createElement("IMG");
						achievementImage.classList.add("achievement_image");
						achievementImage.src = achievementsTrackData[appId]["achievements"][achievementName]["imageUrl"];
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
						achievementDescription.innerText = achievementsTrackData[appId]["achievements"][achievementName]["description"];
						achievementText.appendChild(achievementDescription);
						achievementTextHolder.appendChild(achievementText);
						const buttonsDiv = document.createElement("DIV");
						buttonsDiv.classList.add("buttons");
						const goodButtonArea = document.createElement("DIV");
						const goodButton = document.createElement("DIV");
						goodButton.classList.add("button");
						const goodIcon = document.createElement("DIV");
						goodIcon.classList.add("button_icon", "good_icon", "good_icon_clicked");
						goodButton.appendChild(goodIcon);
						goodButton.addEventListener("mouseover", () => goodIcon.classList.add("good_icon_hover"));
						goodButton.addEventListener("mouseout", () => goodIcon.classList.remove("good_icon_hover"));
						goodButton.addEventListener("click", () => {
							if(confirm(achievementsTrackData[appId]["name"] + "の実績「" + achievementName + "」の追跡を解除しますか？" )) {
								delete achievementsTrackData[appId]["achievements"][achievementName];
								achievementRow.remove();
								let upVotedAchievementFound = false;
								for(let achievementNameInApp in achievementsTrackData[appId]["achievements"]) {
									if(achievementsTrackData[appId]["achievements"][achievementNameInApp]["vote"] == 1) {
										upVotedAchievementFound = true;
										break;
									}
								}
								if(!upVotedAchievementFound) {
									if(Object.keys(achievementsTrackData[appId]["achievements"]).length == 1) {
										delete achievementsTrackData[appId];
										chrome.storage.local.remove(appId);	
									}
									gameBlock.remove();
									if(achievementsColumn.childElementCount == 1) {
										message.innerHTML = "現在Steam実績は1つも追跡されていません。<span id=\"steam_link\" class=\"link\">Steam</span>の実績のページにアクセスして、取得できそうな実績を探してみましょう！";
										steamLink();
									}
								}
								chrome.storage.local.set(achievementsTrackData);
							}
						});
						goodButtonArea.appendChild(goodButton);
						buttonsDiv.appendChild(goodButtonArea);
						const badButton = document.createElement("DIV");
						badButton.classList.add("button");
						const badButtonArea = document.createElement("DIV");
						const badIcon = document.createElement("DIV");
						badIcon.classList.add("button_icon", "bad_icon");
						badButton.appendChild(badIcon);
						badButton.addEventListener("mouseover", () => badIcon.classList.add("bad_icon_hover"));
						badButton.addEventListener("mouseout", () => badIcon.classList.remove("bad_icon_hover"));
						badButton.addEventListener("click", () => {
							if(confirm(achievementsTrackData[appId]["name"] + "の実績「" + achievementName + "」の追跡を解除しますか？" )) {
								achievementsTrackData[appId]["achievements"][achievementName]["vote"] = -1;
								chrome.storage.local.set(achievementsTrackData);
								console.log(Object.keys(achievementsTrackData[appId]["achievements"]).length);
								let upVotedAchievementFound = false;
								for(let achievementNameInApp in achievementsTrackData[appId]["achievements"]) {
									if(achievementsTrackData[appId]["achievements"][achievementNameInApp]["vote"] == 1) {
										upVotedAchievementFound = true;
										break;
									}
								}
								if(!upVotedAchievementFound) {
									gameBlock.remove();
									if(achievementsColumn.childElementCount == 1) {
										message.innerHTML = "現在Steam実績は1つも追跡されていません。<span id=\"steam_link\" class=\"link\">Steam</span>の実績のページにアクセスして、取得できそうな実績を探してみましょう！";
										steamLink();
									}
								}
								achievementRow.remove();
							}
						});
						badButtonArea.appendChild(badButton);
						buttonsDiv.appendChild(badButtonArea);
						achievementTextHolder.appendChild(buttonsDiv);
	
						achievementRow.appendChild(achievementTextHolder);
						achievementsList.appendChild(achievementRow);
						gameBlock.appendChild(achievementsList);
					}
				});
				achievementsColumn.appendChild(gameBlock);
				achievementFound = true;
				break;			
			}
		}
		if(achievementFound) break;
	}
});