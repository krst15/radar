(function() {
	'use strict';

	var app = {
		once: false,
		base: "<img class='top' src='outlines.png'/>",
		bottom: document.querySelector(".bottom"),
		latest: document.querySelector(".date"),
		picture: document.querySelector(".picture"),
		table: null,
		tableDiv: document.querySelector(".tableDiv"),
		collection: [],
		piclink: ""
	};
	function table() {
		app.collection.forEach(function(f) {
			if (add(f.time) == false) {
				var row = app.table.insertRow();
				var cell1 = row.insertCell(0);
				cell1.innerHTML = "<div class='td'>"+f.time+"</div>";
				cell1.addEventListener("click", function(c) {
					var index = stepTime(cell1.textContent);
					app.picture.innerHTML = app.base+"<img class='bottom' src="+app.collection[index].img+"/>";
					app.latest.innerHTML = app.collection[index].time;
					highlight(app.collection[index].time);
					app.piclink = app.collection[index].img;
				})
				highlight(f.time);
			}
		})
	}
	function add(t) {
		var row = app.table.rows;
		for (var i = 0; i < row.length; i++) {
			if (row[i].cells[0].textContent === t) {
				return true;
			}
		}
		return false;
	}
	function highlight(t) {
		var row = app.table.rows;
		for (var i = 0; i < row.length; i++) {
			if (row[i].cells[0].textContent == t) {
				row[i].style = "background-color:#b2cce0;font-style:italic;";
			} else {
				row[i].style = "";
			}
		}
	}
	function clear() {
		if (app.bottom) {
			app.bottom.remove();
			app.latest.innerHTML = "";
		}
	}
	function stepTime(t) {
		return app.collection.findIndex(x => x.time==t);
	}
	function step(p) {
		return app.collection.findIndex(x => x.img==p);
	}
	function stepBack() {
		var index = step(app.piclink);
		if (app.collection.length > 1) {
			if (app.piclink) {
				if (app.collection[index -1] != undefined) {
					app.picture.innerHTML = app.base+"<img class='bottom' src="+app.collection[index-1].img+"/>";
					app.latest.innerHTML = app.collection[index-1].time;
					highlight(app.collection[index-1].time);
					app.piclink = app.collection[index-1].img;
				}
			}
		}
	}
	function stepForward() {
		var index = step(app.piclink);
		if (app.collection.length > 1) {
			if (index+1 < app.collection.length) {
				if (app.collection[index+1] != undefined) {
					app.picture.innerHTML = app.base+"<img class='bottom' src="+app.collection[index+1].img+"/>";
					app.latest.innerHTML = app.collection[index+1].time;
					highlight(app.collection[index+1].time);
					app.piclink = app.collection[index+1].img;
				}
			}
		}
	}
	function run() {
		var index = 0;
		app.picture.innerHTML = app.base+"<img class='bottom' src="+app.collection[index].img+"/>";
		app.latest.innerHTML = app.collection[index].time;
		highlight(app.collection[index].time);
		app.piclink = app.collection[index].img;
		var interval = setInterval(function() {
			index++
			if (app.collection[index] != undefined) {
				app.picture.innerHTML = app.base+"<img class='bottom' src="+app.collection[index].img+"/>";
				app.latest.innerHTML = app.collection[index].time;
				highlight(app.collection[index].time);
				app.piclink = app.collection[index].img;
			} else {
				clearInterval(interval);
			}
		}, 250);
	}
	function runOnce(files) {
		app.once = true;
		var table = document.createElement("table");
		var tr = document.createElement("tr");
		var th = document.createElement("th");
		th.innerHTML = "Time";
		tr.appendChild(th);
		table.appendChild(tr);
		app.tableDiv.appendChild(table);
		app.table = table;

		for (var i = 14; i > 0; i--) {
			var result = {};
			var link = files[files.length-i].formats[0].link;
			var date = new Date(files[files.length-i].formats[0].updated).toLocaleString();
			result.img = link;
			result.time = date;
			app.collection.push(result);
		}
		document.querySelector(".back").disabled = false;
		document.querySelector(".back").addEventListener("click", function() {
			clear();
			stepBack();
		});
		document.querySelector(".forward").disabled = false;
		document.querySelector(".forward").addEventListener("click", function() {
			clear();
			stepForward();
		});
		document.querySelector(".run").disabled = false;
		document.querySelector(".run").addEventListener("click", function() {
			clear();
			run();
		})
		setInterval(function() {
			getRadar();
		}, 120000);
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
			if (app.once != true) {
				runOnce(files);
			}
			var link = files[files.length-1].formats[0].link;
			var date2 = new Date(files[files.length-1].formats[0].updated).toLocaleString();
			if (app.collection[0] == undefined || link != app.collection[app.collection.length -1].img) {
				result.img = link;
				app.piclink = link;
				result.time = date2;
				app.collection.push(result);
			}
			table();
			app.picture.innerHTML = app.base+"<img class='bottom' src="+link+"/>";
			app.latest.innerHTML = date2;
		})
	}
	function activate() {
		document.querySelector(".back").disabled = false;
		document.querySelector(".back").addEventListener("click", function() {
			clear();
			stepBack();
		});
		document.querySelector(".forward").disabled = false;
		document.querySelector(".forward").addEventListener("click", function() {
			clear();
			stepForward();
		});
		document.querySelector(".run").disabled = false;
		document.querySelector(".run").addEventListener("click", function() {
			clear();
			run();
		})
		setInterval(function() {
			getRadar();
		}, 120000);
	}
	function main() {
		document.querySelector(".button").addEventListener("click", function() {
			clear();
			getRadar();
		});
		if (app.collection.length == 0) {
			document.querySelector(".back").disabled = true;
			document.querySelector(".forward").disabled = true;
			document.querySelector(".run").disabled = true;
		} else {
			activate();
		}
	};
	main();
})();
