const myNameElement = document.getElementById("account_pulldown");
const achievementsOrderedList = [];

if(myNameElement) {
	const personaNameTextClassElements = document.getElementsByClassName("persona_name_text_content");
	if(personaNameTextClassElements.item(personaNameTextClassElements.length - 1).innerText.slice(0, -1) == myNameElement.innerText) {
		chrome.storage.sync.get(null, (data) => {
			const achievementsTrackData = data;

			function upVoteAchievement(achievementRowElement) {
				//実績をgoodする
				achievementRowElement.lastElementChild.classList.remove("sat_bad_row");
				achievementRowElement.lastElementChild.classList.add("sat_good_row");
				achievementRowElement.lastElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild.classList.add("sat_good_icon_clicked");
				achievementRowElement.lastElementChild.lastElementChild.lastElementChild.firstElementChild.firstElementChild.classList.remove("sat_bad_icon_clicked");
				addAchievementsData(achievementRowElement.lastElementChild.firstElementChild.firstElementChild.innerText, { description: achievementRowElement.lastElementChild.firstElementChild.children.item(1).innerText, imageUrl: achievementRowElement.firstElementChild.firstElementChild.src, vote: 1 });
			}
		
			function downVoteAchievement(achievementRowElement) {
				//実績をbadする
				achievementRowElement.lastElementChild.classList.remove("sat_good_row");
				achievementRowElement.lastElementChild.classList.add("sat_bad_row");
				achievementRowElement.lastElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild.classList.remove("sat_good_icon_clicked");
				achievementRowElement.lastElementChild.lastElementChild.lastElementChild.firstElementChild.firstElementChild.classList.add("sat_bad_icon_clicked");
				addAchievementsData(achievementRowElement.lastElementChild.firstElementChild.firstElementChild.innerText, { description: achievementRowElement.lastElementChild.firstElementChild.children.item(1).innerText, imageUrl: achievementRowElement.firstElementChild.firstElementChild.src, vote: -1 });
			}
		
			function removeAchievementVote(achievementRowElement) {
				//実績のgood/badを取り消す
				achievementRowElement.lastElementChild.classList.remove("sat_good_row");
				achievementRowElement.lastElementChild.classList.remove("sat_bad_row");
				achievementRowElement.lastElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild.classList.remove("sat_good_icon_clicked");
				achievementRowElement.lastElementChild.lastElementChild.lastElementChild.firstElementChild.firstElementChild.classList.remove("sat_bad_icon_clicked");
				removeAchievementsData(achievementRowElement.lastElementChild.firstElementChild.firstElementChild.innerText);
			}

			function isUnlockedAchievement(achievementRow) {
				//未解除の実績か調べる
				if(achievementRow.tagName != "BR") return achievementRow.lastElementChild.lastElementChild.classList.contains("achieveUnlockTime");
				else return false
			}
		
			function sortAchievements() {
				/*実績の並べ替え
					1. 取得済み実績 -> <br>×3 -> 緑色実績 -> 無色実績 -> 赤色実績 -> 「〇個の秘密の実績が残っている」
					2. 
						- 取得済み実績：そのまま
						- 未取得実績：achievementsOrderedListの順に基づいて並べ替え
				*/
				const achievementListElement = document.getElementById("personalAchieve");
				const achievementList = Array.from(achievementListElement.children);
				achievementList.sort((firstElement, secondElement) => {
					if((isUnlockedAchievement(firstElement) || isUnlockedAchievement(secondElement)) || (firstElement.tagName == "BR" || secondElement.tagName == "BR")) return 0;
					else if(firstElement.firstElementChild.classList.contains("achieveHiddenBox") || secondElement.firstElementChild.classList.contains("achieveHiddenBox")) return 1;
					else {
						let firstElementValue = achievementsOrderedList.indexOf(firstElement.lastElementChild.firstElementChild.firstElementChild.innerHTML);
						let secondElementValue = achievementsOrderedList.indexOf(secondElement.lastElementChild.firstElementChild.firstElementChild.innerHTML);
						if(firstElement.lastElementChild.classList.contains("sat_good_row")) firstElementValue -= achievementListElement.children.length;
						else if(firstElement.lastElementChild.classList.contains("sat_bad_row")) firstElementValue += achievementListElement.children.length;
						if(secondElement.lastElementChild.classList.contains("sat_good_row")) secondElementValue -= achievementListElement.children.length;
						else if(secondElement.lastElementChild.classList.contains("sat_bad_row")) secondElementValue += achievementListElement.children.length;
						return firstElementValue - secondElementValue;
					}
				});
				while(achievementListElement.firstElementChild) achievementListElement.removeChild(achievementListElement.firstElementChild);
				achievementList.forEach((achievementRow) => achievementListElement.appendChild(achievementRow));
			}
			
			function getAppId() {
				//アプリケーションのIDを返す
				const urlSplit = location.href.split("/");
				for(let index in urlSplit) {
					if(urlSplit[Number(index)] == "stats") {
						if(urlSplit[Number(index) + 1] == "appid") return urlSplit[Number(index) + 2];
						else return urlSplit[Number(index) + 1];
					}
				}
			}
			
			function addAchievementsData(achievementName, data) {
				//指定した実績情報を登録
				if(!achievementsTrackData[getAppId()]) {
					achievementsTrackData[getAppId()] = {};
					achievementsTrackData[getAppId()]["name"] = document.getElementsByClassName("profile_small_header_location").item(1).innerText.split(" ").slice(0, -1).join(" ");
					achievementsTrackData[getAppId()]["pageUrl"] = location.href;
					achievementsTrackData[getAppId()]["imageUrl"] = document.querySelectorAll(".gameLogo > a > img").item(0).src;
					achievementsTrackData[getAppId()]["achievements"] = {};
				}
				achievementsTrackData[getAppId()]["achievements"][achievementName] = data;
				try {
					chrome.storage.sync.set(achievementsTrackData);
				}
				catch(error) {
					if(error.message == "Extension context invalidated.") {
						alert("【SteamAchievementsTracker】拡張機能が更新されました。ページを再読み込みして下さい。なお、今回の変更は保存できません。");
					}
				}
			}
		
			function removeAchievementsData(achievementName) {
				//指定した実績情報を削除
				delete achievementsTrackData[getAppId()]["achievements"][achievementName];
				if(Object.keys(achievementsTrackData[getAppId()]["achievements"]).length == 0) {
					delete achievementsTrackData[getAppId()];
					try {
						chrome.storage.sync.remove(getAppId());
					}
					catch(error) {
						if(error.message == "Extension context invalidated.") {
							alert("【SteamAchievementsTracker】拡張機能が更新されました。ページを再読み込みして下さい。なお、今回の変更は保存できません。");
							return;
						}
					}
				}
				try{
					chrome.storage.sync.set(achievementsTrackData);
				}
				catch(error) {
					if(error.message == "Extension context invalidated.") {
						alert("【SteamAchievementsTracker】拡張機能が更新されました。ページを再読み込みして下さい。なお、今回の変更は保存できません。");
					}
				}
			}		

			Array.from(document.getElementById("personalAchieve").children).forEach((achievementRow) => {
				if(isUnlockedAchievement(achievementRow) && achievementsTrackData[getAppId()]) {
					for(let achievementName in achievementsTrackData[getAppId()]["achievements"]) {
						if(achievementRow.lastElementChild.firstElementChild.firstElementChild.innerText == achievementName) removeAchievementsData(achievementName)
					}
				}
				else if(achievementRow.tagName == "DIV" && !isUnlockedAchievement(achievementRow) && achievementRow.firstElementChild.classList.contains("achieveImgHolder")) {
					//順序リストに追加
					achievementsOrderedList.push(achievementRow.lastElementChild.firstElementChild.firstElementChild.innerText);
					//ボタンの生成
					const buttonsDiv = document.createElement("DIV");
					buttonsDiv.classList.add("sat_buttons");
					const goodButtonArea = document.createElement("DIV");
					const goodButton = document.createElement("DIV");
					goodButton.classList.add("sat_button");
					const goodIcon = document.createElement("DIV");
					goodIcon.classList.add("sat_button_icon", "sat_good_icon");
					goodButton.appendChild(goodIcon);
					const goodBallon = document.createElement("P");
					goodBallon.innerText = "この実績は取得できそう！";
					goodBallon.classList.add("sat_ballon", "sat_ballon_good");
					goodButton.addEventListener("mouseover", () => {
						goodIcon.classList.add("sat_good_icon_hover");
						goodBallon.classList.add("sat_ballon_show");
					});
					goodButton.addEventListener("mouseout", () => {
						goodIcon.classList.remove("sat_good_icon_hover");
						goodBallon.classList.remove("sat_ballon_show");
					});
					goodButton.addEventListener("click", () => {
						if(achievementRow.lastElementChild.classList.contains("sat_good_row")) removeAchievementVote(achievementRow);
						else upVoteAchievement(achievementRow);
						sortAchievements();
					});
					goodButtonArea.appendChild(goodButton);
					goodButtonArea.appendChild(goodBallon);
					buttonsDiv.appendChild(goodButtonArea);
					const badButton = document.createElement("DIV");
					badButton.classList.add("sat_button");
					const badButtonArea = document.createElement("DIV");
					const badIcon = document.createElement("DIV");
					badIcon.classList.add("sat_button_icon", "sat_bad_icon");
					badButton.appendChild(badIcon);
					const badBallon = document.createElement("P");
					badBallon.innerText = "この実績は取得できなさそう...";
					badBallon.classList.add("sat_ballon", "sat_ballon_bad");
					badButton.addEventListener("mouseover", () => {
						badIcon.classList.add("sat_bad_icon_hover");
						badBallon.classList.add("sat_ballon_show");
					});
					badButton.addEventListener("mouseout", () => {
						badIcon.classList.remove("sat_bad_icon_hover");
						badBallon.classList.remove("sat_ballon_show");
					});
					badButton.addEventListener("click", () => {
						if(achievementRow.lastElementChild.classList.contains("sat_bad_row")) removeAchievementVote(achievementRow);
						else downVoteAchievement(achievementRow);
						sortAchievements();
					});
					badButtonArea.appendChild(badButton);
					badButtonArea.appendChild(badBallon);
					buttonsDiv.appendChild(badButtonArea);
					achievementRow.lastElementChild.appendChild(buttonsDiv);
					if(achievementsTrackData[getAppId()]) {
						if(achievementsTrackData[getAppId()]["achievements"][achievementRow.lastElementChild.firstElementChild.firstElementChild.innerText]) {
							switch(achievementsTrackData[getAppId()]["achievements"][achievementRow.lastElementChild.firstElementChild.firstElementChild.innerText]["vote"]) {
								case 1:
									upVoteAchievement(achievementRow);
									break;
								case -1:
									downVoteAchievement(achievementRow);
									break;
							}
						}
					}
				}
			});	
			sortAchievements();	
		});	
	}
}