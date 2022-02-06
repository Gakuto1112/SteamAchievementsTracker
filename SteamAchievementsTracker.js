const myNameElement = document.getElementById("account_pulldown");
if(myNameElement) {
	const personaNameTextClassElements = document.getElementsByClassName("persona_name_text_content");
	if(personaNameTextClassElements.item(personaNameTextClassElements.length - 1).innerText.slice(0, -1) == myNameElement.innerText) {
		Array.from(document.getElementById("personalAchieve").children).forEach((element) => {
			if(element.tagName == "DIV" && !element.hasAttribute("data-panel") && element.firstElementChild.classList.contains("achieveImgHolder")) {
				const buttonsDiv = document.createElement("DIV");
				buttonsDiv.classList.add("sat_buttons");
				const goodButton = document.createElement("DIV");
				goodButton.classList.add("sat_button");
				const goodIcon = document.createElement("DIV");
				goodIcon.classList.add("sat_button_icon", "sat_good_icon");
				goodButton.addEventListener("mouseover", () => goodIcon.classList.add("sat_good_icon_hover"));
				goodButton.addEventListener("mouseout", () => goodIcon.classList.remove("sat_good_icon_hover"));
				goodButton.appendChild(goodIcon);
				const badButton = document.createElement("DIV");
				badButton.classList.add("sat_button");
				const badIcon = document.createElement("DIV");
				badIcon.classList.add("sat_button_icon", "sat_bad_icon");
				badButton.addEventListener("mouseover", () => badIcon.classList.add("sat_bad_icon_hover"));
				badButton.addEventListener("mouseout", () => badIcon.classList.remove("sat_bad_icon_hover"));
				badButton.appendChild(badIcon);
				buttonsDiv.appendChild(goodButton);
				buttonsDiv.appendChild(badButton);
				element.lastElementChild.appendChild(buttonsDiv);
			}
		});
	}
}