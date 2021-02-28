const contentContainer = document.querySelector(".content-container");
const amount = document.getElementById("amount-input");
const symbol = document.getElementById("currency-symbol");

const fromDropdown = document.getElementById("from-dropdown");
const fromSearch = document.getElementById("from-search-bar");
const fromInner = document.getElementById("from-inner");

const toDropdown = document.getElementById("to-dropdown");
const toSearch = document.getElementById("to-search-bar");
const toInner = document.getElementById("to-inner");

let countryList, rateList, seen, exchange;

// Fetch initial data to be displayed in search bar

fetch("https://restcountries.eu/rest/v2/all")
	.then(response => {
		console.log(response);
		return response.json();
	})
	.then(json => {
		console.log(json);

		seen = new Array();

		for (i in json) {
			// Create list of country currency code - names using custom function'
			if (
				seen.includes(json[i].currencies[0].code) ||
				json[i].currencies[0].code == null ||
				json[i].currencies[0].code == "(none)"
			) {
			} else if (!seen.includes(json[i].currencies[0].code)) {
				createA(
					`${json[i].currencies[0].code} - ${json[i].currencies[0].name}`,
					fromInner
				);
				createA(
					`${json[i].currencies[0].code} - ${json[i].currencies[0].name}`,
					toInner
				);
				seen.push(json[i].currencies[0].code);
			}
		}

		findSymbol(fromInner);
		// Save json in a variable
		countryList = json;
		return countryList, seen;
	})
	.catch(console.error);

console.log(countryList);

// Create "a" tag for drop down
function createA(Dropdown, Inner) {
	let link = document.createElement("a");
	let linkText = document.createTextNode(Dropdown);
	link.appendChild(linkText);
	link.href = `#${linkText.textContent.split("-")[1].trim()}`;
	Inner.appendChild(link);
}

// Allow search bar to filter dropdown concurrent with user's input

filterFunction(fromSearch, fromInner);
filterFunction(toSearch, toInner);

function filterFunction(Search, Inner) {
	Search.addEventListener("keyup", () => {
		filter = Search.value.toUpperCase();

		a = Inner.getElementsByTagName("a");
		for (i = 0; i < a.length; i++) {
			txtValue = a[i].textContent || a[i].innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				a[i].style.display = "";
			} else {
				a[i].style.display = "none";
			}
		}
	});
}

function findSymbol(Inner) {
	for (let el of Inner.children) {
		el.addEventListener("mousedown", e => {
			getSymbol(e);
			fromSearch.value = `${e.target.textContent}`;
		});
	}

	for (let el of toInner.children) {
		el.addEventListener("mousedown", e => {
			toSearch.value = `${e.target.textContent}`;
		});
	}
}
// Get currency symbol from API (to be displayed when user hover over dropdown)
function getSymbol(e) {
	for (i in countryList) {
		if (
			countryList[i].currencies[0].name ==
			e.target.textContent.split("-")[1].trim()
		) {
			symbol.textContent = countryList[i].currencies[0].symbol;
		}
	}
}
showHide(fromSearch, fromInner);
showHide(toSearch, toInner);

function showHide(Search, Inner) {
	// Show/hide dropdown when searchbar is on focus/out of focus
	Search.addEventListener("focus", () => {
		Inner.classList.add("show");
	});

	Search.addEventListener("focusout", () => {
		Inner.classList.remove("show");
	});
}

function convertCurrency() {
	let fromCurrencyCode = fromSearch.value.split("-")[0].trim();
	let toCurrencyCode = toSearch.value.split("-")[0].trim();

	exchange = `${fromCurrencyCode}_${toCurrencyCode}`;
	console.log(exchange);

	fetch(
		`https://free.currconv.com/api/v7/convert?apiKey=b3659980712acbc52e89&q=${exchange}`
	)
		.then(response => {
			console.log(response);
			return response.json();
		})
		.then(json => {
			cValue = document.getElementById("convertedValue");
			bValue = document.getElementById("baseValue");

			console.log(json);
			baseValue = json.results[exchange].val;

			if (isNaN(amount.value)) {
				cValue.textContent = "Invalid amount";
				bValue.textContent = "";
			} else {
				if (amount.value != 1) {
					convertedValue = amount.value * baseValue;
					cValue.textContent = `${
						amount.value
					} ${fromCurrencyCode} = ${convertedValue.toFixed(
						2
					)} ${toCurrencyCode}`;
					bValue.textContent = `1 ${fromCurrencyCode} = ${baseValue.toFixed(
						2
					)} ${toCurrencyCode}`;
				} else {
					cValue.textContent = "";
					bValue.textContent = `1 ${fromCurrencyCode} = ${baseValue.toFixed(
						2
					)} ${toCurrencyCode}`;
				}
			}
		})
		.catch(console.error);
}
