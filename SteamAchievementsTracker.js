const myNameElement = document.getElementById("account_pulldown");
if(myNameElement) {
	const personaNameTextClassElements = document.getElementsByClassName("persona_name_text_content");
	if(personaNameTextClassElements.item(personaNameTextClassElements.length - 1).innerText.slice(0, -1) == myNameElement.innerText) {
		Array.from(document.getElementById("personalAchieve").children).forEach((element) => {
			if(element.tagName == "DIV" && !element.hasAttribute("data-panel") && element.firstElementChild.classList.contains("achieveImgHolder")) {
				//ボタンの生成
				const buttonsDiv = document.createElement("DIV");
				buttonsDiv.classList.add("sat_buttons");
				const goodButton = document.createElement("DIV");
				goodButton.classList.add("sat_button");
				const goodIcon = document.createElement("DIV");
				goodIcon.classList.add("sat_button_icon", "sat_good_icon");
				goodButton.appendChild(goodIcon);
				const badButton = document.createElement("DIV");
				badButton.classList.add("sat_button");
				const badIcon = document.createElement("DIV");
				badIcon.classList.add("sat_button_icon", "sat_bad_icon");
				badButton.appendChild(badIcon);
				buttonsDiv.appendChild(goodButton);
				buttonsDiv.appendChild(badButton);
				element.lastElementChild.appendChild(buttonsDiv);
				//吹き出しの生成
				const goodBallon = document.createElement("P");
				goodBallon.innerText = "この実績は取得できそう！";
				goodBallon.classList.add("sat_ballon");
				const goodButtonRect = goodButton.getBoundingClientRect();
				goodBallon.style.top = window.scrollY + goodButtonRect.top - 60 + "px";
				goodBallon.style.left = window.scrollX + goodButtonRect.left - 43 + "px";
				goodButton.addEventListener("mouseover", () => {
					goodIcon.classList.add("sat_good_icon_hover");
					goodBallon.classList.add("sat_ballon_show");
				});
				goodButton.addEventListener("mouseout", () => {
					goodIcon.classList.remove("sat_good_icon_hover");
					goodBallon.classList.remove("sat_ballon_show");
				});
				document.body.append(goodBallon);
				const badBallon = document.createElement("P");
				badBallon.innerText = "この実績は取得できなさそう...";
				badBallon.classList.add("sat_ballon");
				const badButtonRect = badButton.getBoundingClientRect();
				badBallon.style.top = window.scrollY + badButtonRect.top - 60 + "px";
				badBallon.style.left = window.screenX + badButtonRect.left - 43 + "px";
				badButton.addEventListener("mouseover", () => {
					badIcon.classList.add("sat_bad_icon_hover");
					badBallon.classList.add("sat_ballon_show");
				});
				badButton.addEventListener("mouseout", () => {
					badIcon.classList.remove("sat_bad_icon_hover");
					badBallon.classList.remove("sat_ballon_show");
				});
				document.body.append(badBallon);
			}
		});
	}
}