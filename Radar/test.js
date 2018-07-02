(function() {
	'use strict';
	
	var app = {
		base: "<img class='top' src='outlines.png'/>",
		bottom: document.querySelector(".bottom"),
		latest: document.querySelector(".date"),
		picture: document.querySelector(".picture"),
		table: document.querySelector(".table"),
		collection: [],
		piclink: ""
	};
	function table() {
		app.collection.forEach(function(f) {
			if (hightlight(f.time) == false) {
				var row = app.table.insertRow();
				var cell1 = row.insertCell(0);
				cell1.style = "background-color:yellow;";
				cell1.innerHTML = "<div class='td'>"+f.time+"</div>";
			}
		})
	}
	function hightlight(t) {
		for (var i = 0, row; row = app.table.rows[i]; i++) {
			if (row.innerText == t) {
				row.style = "background-color:yellow;";
				return true;
			} else {
				row.style = "";
			}
		}
		return false;
	}
	function clear() {
		if (app.bottom) {
			app.bottom.remove();
			app.latest.innerHTML = "";
		}
	}
	function step(pic) {
		return app.collection.findIndex(x => x.img==pic);
	}
	function stepBack() {
		if (app.collection.length > 0) {
			if (step(app.piclink) > 0) {
				app.picture.innerHTML = app.base+"<img class='bottom' src="+app.collection[step(app.piclink)-1].img+"/>";
				app.latest.innerHTML = app.collection[step(app.piclink)-1].time;
				app.piclink = app.collection[step(app.piclink)-1].img;
			}
		}
	}
	function stepForward() {
		if (app.collection.length > 0) {
			if (step(app.piclink)+1 < app.collection.length) {
				if (app.collection[step(app.piclink)+1] != undefined) {
					app.picture.innerHTML = app.base+"<img class='bottom' src="+app.collection[step(app.piclink)+1].img+"/>";
					app.latest.innerHTML = app.collection[step(app.piclink)+1].time;
					app.piclink = app.collection[step(app.piclink)+1].img;
				}
			}
		}
	}
	function getRadar() {
		var result = {};
		var ep = "https://opendata-download-radar.smhi.se/api/version/latest/area/sweden/product/comp/{year}/{month}/{day}?format=png";
		var date = new Date(new Date().toLocaleString());
 		var url = ep.replace("{year}", date.getFullYear()).replace("{month}", date.getMonth()+1).replace("{day}", date.getDate());	
		fetch(url)
		.then(function(response) {
		return response.json()
		})
		.then(function(response) {
			var files = response.files;
			var link = files[files.length-1].formats[0].link;
			var date2 = new Date(files[files.length-1].formats[0].updated).toLocaleString();
			if (app.collection[0] == undefined || link != app.collection[app.collection.length -1].img) {
				result.img = link;
				app.piclink = link;
				result.time = date2;
				app.collection.push(result);
			}
			app.picture.innerHTML = app.base+"<img class='bottom' src="+link+"/>";
			app.latest.innerHTML = date2;
		})
		.then(
		table());
	}
	function main() {
		document.querySelector(".button").addEventListener("click", function() {
			clear();
			getRadar();
		});
		document.querySelector(".back").addEventListener("click", function() {
			clear();
			stepBack();
		});
		document.querySelector(".forward").addEventListener("click", function() {
			clear();
			stepForward();
		});
	};
	app.collection.push({img: "https://opendata-download-radar.smhi.se/api/version/latest/area/sweden/product/comp/2018/06/28/radar_1806281000.png", time: "2018-06-28 12:01:41"});
	app.collection.push({img: "https://opendata-download-radar.smhi.se/api/version/latest/area/sweden/product/comp/2018/06/28/radar_1806281040.png", time: "2018-06-28 12:41:46"});
	main();
})();

