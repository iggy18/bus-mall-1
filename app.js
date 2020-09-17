var productImg = {};
var roundsAllowed = 25;
var roundCount = roundsAllowed;
var productDisplay = document.getElementById('productDisplay');
var treasureChest = window.localStorage;

function Product(userName, codeName, imgUrl){
	this.name = userName;
	eval('productImg.'+codeName+' = \''+imgUrl+'\'');
	this.selected = 0;
	this.shown = 0;
}

var bag = new Product("R2D2 Luggage","bag", "images/bag.jpg");
var banana = new Product('Banana Slicer','banana', 'images/banana.jpg');
var bathroom = new Product('Bathroom Smart Device Stand','bathroom', 'images/bathroom.jpg');
var boots = new Product('Open Toed Boots','boots', 'images/boots.jpg');
var breakfast = new Product('All In One Breakfast Maker','breakfast', 'images/breakfast.jpg');
var bubblegum = new Product('Meatball Bubblegum','bubblegum', 'images/bubblegum.jpg');
var chair = new Product('Uncomfortable Chair','chair', 'images/chair.jpg');
var cthulu = new Product('Cthulu Figurine','cthulu', 'images/cthulhu.jpg');
var dogDuck = new Product('Dog Duck Bill','dogDuck', 'images/dog-duck.jpg');
var dragon = new Product('Canned Dragon Meat','dragon', 'images/dragon.jpg');
var pen = new Product('Utensil Pen Caps','pen', 'images/pen.jpg');
var petSweep = new Product('Pet Sweeping Booties','petSweep', 'images/pet-sweep.jpg');
var scissors = new Product('Pizza Scissors','scissors', 'images/scissors.jpg');
var shark = new Product('Shark Sleeping Bag','shark', 'images/shark.jpg');
var sweep = new Product('Baby Sweeping Outfit','sweep', 'images/sweep.png');
var tauntaun = new Product('Tauntaun Sleeping Bag','tauntaun', 'images/tauntaun.jpg');
var unicorn = new Product('Canned Unicorn Meat','unicorn', 'images/unicorn.jpg');
var usb = new Product('Tentacle USB Plugin','usb', 'images/usb.gif');
var waterCan = new Product('Water Can','waterCan', 'images/water-can.jpg');
var wineGlass = new Product('Awkward Wine Glass','wineGlass', 'images/wine-glass.jpg');

function selectProducts(items, hasRan){
	var bufferDict = {};
	var displayedProducts = [];
	//create an array of the key names in productImg
	var keychainShow = Object.keys(productImg);
	//remove previously used keys; will always be last indices if ran before
	if (hasRan) {
		for (var i = 0; i < items; i++){
			keychainShow.pop();
		}
	} else if (treasureChest.getItem(keychainShow[0])) {
		for (var i = 0; i < keychainShow.length; i++) {
			var importedData = JSON.parse(treasureChest.getItem(keychainShow[i]));
			eval(keychainShow[i]+'.shown = importedData[0]');
			eval(keychainShow[i]+'.selected = importedData[1]');
		}
	}

	//math to calculate desired width/height of photos
	var calculateWidth = ((100 - (items+2)) / items) / 1.5;
	var viewWidth = String(calculateWidth)+'vw';

	function doTheDomStuff(key){
		for (var i = 0; i < keychainShow.length; i++){
			if (keychainShow[i] == key) {
				keychainShow.splice(i, 1);
			}
		}

		//Create the image and assign attributes
		var newImage = document.createElement('img');
		newImage.setAttribute('class', 'displayedProduct');
		newImage.setAttribute('src', productImg[key]);
		newImage.setAttribute('style', 'width:'+viewWidth+';height:'+viewWidth+';margin-left:8vw;margin-top:1vw;');
		newImage.setAttribute('float', 'left');

		//add the displayed element to an array for later reference
		displayedProducts.push(key);

		eval('bufferDict.'+key+' = \''+productImg[key]+'\'');
		eval('delete productImg.'+key);

		//Create event listeners for picture clicks on images;
		newImage.addEventListener('click', function(e) {
			e.preventDefault();
			registerVote(displayedProducts, key);
		}, false);
		//append the image to the div
		productDisplay.append(newImage);
	}

	for (var i = 0; i < items; i++){
		//create a random index in the length of productImg
		var useIndex = Math.floor(Math.random()*keychainShow.length);
		//create a variable to simplify further use of keychainShow at useIndex
		var currentKey = keychainShow[useIndex];
		doTheDomStuff(currentKey);
	}
	var deletedPairs = Object.entries(bufferDict); //if 3 items will be length 6; loop will count 0, 2,
	// console.log(deletedPairs);
	for (var i = 0; i < deletedPairs.length; i+=1){
		eval('productImg.'+deletedPairs[i][0]+' = \''+deletedPairs[i][1]+'\'');
		eval('delete bufferDict.'+deletedPairs[i][0]);
	}
}

function registerVote(displayedProducts, selectedProduct){
	//delete loaded images
	var keychainVote = Object.keys(productImg);
	productDisplay.innerHTML='';
	//reduce rounds left
	roundCount--;
	//register what URLs were listed and which of them was picked; tally a .shown for all and a .selected for the one chosen; if roundCount is > 0, run selectProducts again with the same items value (number of URLs read). If roundCount is zero reset to roundsAllowed value and remove event listeners. Display ALL products with their votes received and times on screen. "Banana Slicer had 3 votes and was shown 5 times"
	eval(selectedProduct+'.selected+=1');
	for (var i = 0; i < displayedProducts.length; i++){
		eval(displayedProducts[i]+'.shown+=1');
	}

	if (roundCount) {
		selectProducts(displayedProducts.length, 1);
	} else {
		// roundCount = roundsAllowed;
		var dataToAnalyze = [];
		for (var i = 0; i < keychainVote.length; i++){
			var itemUserName = eval(keychainVote[i]+'.name');
			var itemSelected = eval(keychainVote[i]+'.selected');
			var itemShown = eval(keychainVote[i]+'.shown');
			//store final data for all elements in local storage
			treasureChest.setItem(keychainVote[i], JSON.stringify([itemShown, itemSelected]));
			//continue making results
			dataToAnalyze.push(itemUserName);
			dataToAnalyze.push(itemSelected);
			var newContainer = document.createElement('div');
			newContainer.setAttribute('style', 'width:24vw;height:32vw;margin-left:6vw;margin-top:2vw;display:inline-block;border-width:2px;border-style:solid;background-color:lightgrey;position:relative;')
			productDisplay.append(newContainer);
			var newImage = document.createElement('img');
			newContainer.append(newImage);
			newImage.setAttribute('src', productImg[keychainVote[i]]);
			newImage.setAttribute('style', 'margin-left:4vw;margin-top:2vw;width:16vw;height:16vw;border:2px solid black;');
			var imageStats = document.createElement('p');
			imageStats.setAttribute('class', 'productStats');
			imageStats.setAttribute('style', 'width:18vw;height:3vw;margin-left:2vw;margin-top:1vw;text-align:center;font-size:1vw;');
			newContainer.append(imageStats);
			imageStats.textContent = itemUserName+' had '+itemSelected+' votes and was shown '+itemShown+' times';
			var chartContainer = document.createElement('div');
			newContainer.append(chartContainer);
			chartContainer.setAttribute('style', 'margin-left:4vw;margin-top:1vw;height:16vw;width:16vw;');			
			console.log(newImage.height);

			var newChart = document.createElement('canvas');
			chartContainer.append(newChart);
			var ctx = newChart.getContext('2d');
			var myChart = new Chart(ctx, {
				type:'bar',
				data: {
					labels: ['Shown', 'Selected'],
					datasets: [{
						label: 'number of times', 
						data: [itemShown, itemSelected],
						backgroundColor: [
							'rgba(204,204,0)',
							'rgba(51, 204, 51)',
						],
						borderColor: [
							'rgba(0,0,0)',
							'rgba(0,0,0)',
						],
						borderWidth: 1
					}]
				},
				options: {
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					}
				}
			});

		}
		var dataAnalysis = document.getElementById('dataAnalysis');

		var doughnutChart = document.createElement('canvas');
		dataAnalysis.append(doughnutChart);
		var ctx2 = doughnutChart.getContext('2d');
		
		var myDoughnutChart = new Chart(ctx2, {
			type:'doughnut',
			data:  {
				datasets: [{
					data: [dataToAnalyze[1], dataToAnalyze[3], dataToAnalyze[5], dataToAnalyze[7], dataToAnalyze[9], dataToAnalyze[11], dataToAnalyze[13], dataToAnalyze[15], dataToAnalyze[17], dataToAnalyze[19], dataToAnalyze[21], dataToAnalyze[23], dataToAnalyze[25], dataToAnalyze[27], dataToAnalyze[29], dataToAnalyze[31], dataToAnalyze[33], dataToAnalyze[35], dataToAnalyze[37], dataToAnalyze[39]],
					backgroundColor: [
						'rgba(204,204,0)',
						'rgba(51, 204, 51)',
						'rgba(77,77,255)',
						'rgba(153,102,0)',
						'rgba(255,170,0)',
						'rgba(255,0,0)',
						'rgba(77,0,0)',
						'rgba(255,102,204)',
						'rgba(102,0,68)',
						'rgba(153,153,102)',
						'rgba(0,179,60)',
						'rgba(102,153,153)',
						'rgba(0,255,255)',
						'rgba(102,102,153)',
						'rgba(204,102,102)',
						'rgba(115,153,0)',
						'rgba(51,255,204)',
						'rgba(102,102,255)',
						'rgba(255,204,204)',
						'rgba(51,34,0)'
					]
				}],

				labels: [
					dataToAnalyze[0], dataToAnalyze[2], dataToAnalyze[4], dataToAnalyze[6], dataToAnalyze[8], dataToAnalyze[10], dataToAnalyze[12], dataToAnalyze[14], dataToAnalyze[16], dataToAnalyze[18], dataToAnalyze[20], dataToAnalyze[22], dataToAnalyze[24], dataToAnalyze[26], dataToAnalyze[28], dataToAnalyze[30], dataToAnalyze[32], dataToAnalyze[34], dataToAnalyze[36], dataToAnalyze[38]
				]
			}
		});
	}
}

window.focus();
window.scrollTo(0,0);

var promptForms = document.createElement('form');
productDisplay.append(promptForms);
promptForms.setAttribute('style', 'margin-left:25vw;margin-top:5vw;');
var promptField = document.createElement('fieldset');
promptForms.append(promptField);
promptField.setAttribute('style', 'width:50vw;height:12vw;border:2px solid black;');
var promptLegend = document.createElement('legend');
promptField.append(promptLegend);
promptLegend.setAttribute('style', 'font-size:1.5vw;margin-left:10vw;');
promptLegend.textContent = 'How many items do you want to see at once?';
var promptInput = document.createElement('input');
promptField.append(promptInput);
promptInput.setAttribute('type', 'number');
promptInput.setAttribute('max', '8');
promptInput.setAttribute('min', '2');
promptInput.setAttribute('style', 'margin-left:8vw;margin-top:4vw;font-size:1.5vw;width:20vw;');
promptInput.required = true;
var promptSubmit = document.createElement('input');
promptField.append(promptSubmit);
promptSubmit.setAttribute('type', 'submit');
promptSubmit.setAttribute('value', 'Submit');
promptSubmit.setAttribute('style', 'margin-left:2vw;font-size:1vw;');

promptForms.addEventListener('submit', function(e) {
			e.preventDefault();
			var numProducts = parseInt(promptInput.value);
			productDisplay.innerHTML = '';
			selectProducts(numProducts, 0);;
		}, false);

