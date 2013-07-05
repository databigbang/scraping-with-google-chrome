var db = [];

function nextPage () {
	var nextButton = document.getElementsByClassName('j-pagination-next j-disabled font-color-meta');

	if(nextButton.length == 0) {
		var next = document.getElementsByClassName('j-pagination-next');
		next[0].click();

		return true;
	}
	else {
		return false;
	}
}


function getTitles() {
	var title = document.evaluate("//td[@class='j-td-title']/div/a", document, null, XPathResult.ANY_TYPE, null);
	var iterator = title.iterateNext();

	var titles = [];

	while (iterator) {
		titles.push(iterator.textContent);
		iterator = title.iterateNext();
	}

	return titles;
}


function getDates () {
	var date = document.evaluate("//td[@class='j-td-date font-color-meta vm-lastMessage-dt']", document, null, XPathResult, null);
	var iterator = date.iterateNext();

	var dates = [];

	while (iterator) {
		dates.push(iterator.childNodes[0].textContent);
		iterator = date.iterateNext();
	}

	return dates;
}


function getThreads () {
	var threads = getTitles();
	var dates = getDates();

	var threadsLength = threads.length;
	var views = [];
		
	for (var i = 0; i < threadsLength; i++) {
		views.push(document.getElementsByClassName('j-td-views')[i].textContent);
	}
	
	for (var i = 0; i < threadsLength; i++) {
		var item = {"title": threads[i], "views": views[i], "date": dates[i]};
		db.push(item);
	}

	var iterator = nextPage();

	if (iterator == true) {
		return true;
	}
	else {
		return false;
	}
}

function main(depth) {
	if (typeof depth === "undefined")
		depth = -1;
		
	if(depth == 0) {
		var json_text = JSON.stringify(db, null, 2);
		console.log(json_text);
	
		return;
	}
		
	setTimeout(function() {
		var iterator = getThreads();

		if (iterator == true) {
			if(depth == -1)
				main(depth);
			else
				main(depth-1);
		}
		else {
			main(0);
		}
	}, 7000);
}

main();