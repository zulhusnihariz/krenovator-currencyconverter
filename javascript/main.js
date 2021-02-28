const contentContainer = document.querySelector(".content-container");
const amount = document.getElementById("amount-input");
const symbol = document.getElementById("currency-symbol");

const fromDropdown = document.getElementById("from-dropdown");
const fromSearch = document.getElementById("from-search-bar");
const fromInner = document.getElementById("from-inner");

const toDropdown = document.getElementById("to-dropdown");
const toSearch = document.getElementById("to-search-bar");
const toInner = document.getElementById("to-inner");

// Fetch initial data to be displayed in search bar
fetch("https://restcountries.eu/rest/v2/all")
	.then(response => {
		console.log(response);
		return response.json();
	})
	.then(json => {
		for (i in json) {
			// Create list of country currency code - names using custom function
			createA(`${json[i].currencies[0].code} - ${json[i].name} `);
		}

		for (let el of fromInner.children) {
			el.addEventListener("mouseover", event => {
				event.preventDefault();
				getSymbol(event);
				console.log("hello");
			});
		}

		for (let el of toInner.children) {
			el.addEventListener("mouseover", event => {
				event.preventDefault();
				getSymbol(event);
				console.log("hello");
			});
		}

		console.log(json[0].currencies);
	})
	.catch(console.error);

// Create "a" tag for drop down
function createA(parameter) {
	let link = document.createElement("a");
	let linkText = document.createTextNode(parameter);
	link.appendChild(linkText);
	link.href = `#${linkText.textContent.split("-")[1].trim()}`;
	fromInner.appendChild(link);
}

// Allow search bar to filter dropdown concurrent with user's input
function filterFunction() {
	filter = fromSearch.value.toUpperCase();

	a = fromInner.getElementsByTagName("a");
	for (i = 0; i < a.length; i++) {
		txtValue = a[i].textContent || a[i].innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			a[i].style.display = "";
		} else {
			a[i].style.display = "none";
		}
	}
}

// Get currency symbol from API (to be displayed when user hover over dropdown)
function getSymbol(e) {
	fetch("https://restcountries.eu/rest/v2/all")
		.then(response => {
			console.log(response);
			return response.json();
		})
		.then(json => {
			for (i in json) {
				if (json[i].name == e.target.textContent.split("-")[1].trim()) {
					symbol.textContent = `${json[i].currencies[0].symbol}`;
				}
			}
		})
		.catch(console.error);
}
showHide();
function showHide() {
	// Show/hide dropdown when searchbar is on focus/out of focus
	fromSearch.addEventListener("focus", () => {
		fromInner.classList.add("show");
	});

	fromSearch.addEventListener("focusout", () => {
		fromInner.classList.remove("show");
	});
}
