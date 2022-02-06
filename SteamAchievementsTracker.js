const myNameElement = document.getElementById("account_pulldown");
const achievementsOrderedList = [];

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
		if((firstElement.hasAttribute("data-panel") || secondElement.hasAttribute("data-panel")) || (firstElement.tagName == "BR" || secondElement.tagName == "BR")) return 0;
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

if(myNameElement) {
	const personaNameTextClassElements = document.getElementsByClassName("persona_name_text_content");
	if(personaNameTextClassElements.item(personaNameTextClassElements.length - 1).innerText.slice(0, -1) == myNameElement.innerText) {
		Array.from(document.getElementById("personalAchieve").children).forEach((achievementRow) => {
			if(achievementRow.tagName == "DIV" && !achievementRow.hasAttribute("data-panel") && achievementRow.firstElementChild.classList.contains("achieveImgHolder")) {
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
					const achievementRow = goodButton.parentElement.parentElement.parentElement;
					if(achievementRow.classList.contains("sat_good_row")) {
						achievementRow.classList.remove("sat_good_row");
						goodIcon.classList.remove("sat_good_icon_clicked");
					}
					else {
						achievementRow.classList.remove("sat_bad_row");
						achievementRow.classList.add("sat_good_row");
						goodIcon.classList.add("sat_good_icon_clicked");
						badIcon.classList.remove("sat_bad_icon_clicked");
					}
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
					const achievementRow = goodButton.parentElement.parentElement.parentElement;
					if(achievementRow.classList.contains("sat_bad_row")) {
						achievementRow.classList.remove("sat_bad_row");
						badIcon.classList.remove("sat_bad_icon_clicked");
					}
					else {
						achievementRow.classList.remove("sat_good_row");
						achievementRow.classList.add("sat_bad_row");
						goodIcon.classList.remove("sat_good_icon_clicked");
						badIcon.classList.add("sat_bad_icon_clicked");
					}
					sortAchievements();
				});
				badButtonArea.appendChild(badButton);
				badButtonArea.appendChild(badBallon);
				buttonsDiv.appendChild(badButtonArea);
				achievementRow.lastElementChild.appendChild(buttonsDiv);
			}
		});
	}
}