(function() {
	'use strict';

	var app = {
		once: false,
		base: "<img class='top' src='outlines.png'/>",
		bottom: document.querySelector(".bottom"),
		latest: document.querySelector(".date"),
		picture: document.querySelector(".picture"),
		tableDiv: document.querySelector(".tableDiv"),
		timer: document.querySelector(".timer"),
		intervals: null,
		table: null,
		piclink: "",
        map: new Map()
	};
	function table() {
        app.map.forEach(function(value, key) {
            if (add(key) == false) {
                var row = app.table.insertRow();
                var cell1 = row.insertCell(0);
                cell1.innerHTML = "<div class='td'>"+key+"</div>";
                cell1.addEventListener("click", function(c) {
                    app.picture.innerHTML = app.base+"<img class='bottom' src="+value+"/>";
                    app.latest.innerHTML = key;
                    highlight(key);
                    app.piclink = value;
                })
            }
			highlight(key);
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
	function stepBack() {
		var index = app.latest.innerHTML;
        var arr = Array.from(app.map.keys());
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == index) {
                if (app.map.get(arr[i-1]) != undefined) {
                	app.picture.innerHTML = app.base+"<img class='bottom' src="+app.map.get(arr[i-1])+"/>";
                	app.latest.innerHTML = arr[i-1];
                	highlight(arr[i-1]);
                	app.piclink = app.map.get(arr[i-1]);
                }
            }
        }
    }
	function stepForward() {
		var index = app.latest.innerHTML;
		var arr = Array.from(app.map.keys());
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == index) {
				if (app.map.get(arr[i+1]) != undefined) {
					app.picture.innerHTML = app.base+"<img class='bottom' src="+app.map.get(arr[i+1])+"/>";
					app.latest.innerHTML = arr[i+1];
					highlight(arr[i+1]);
					app.piclink = app.map.get(arr[i+1]);
				}
			}
		}
	}
	function cacheFetch(pic) {
		caches.open("images").then(function(cache) {
			cache.match(pic).then(function(f) {
				console.log(f);
				return f.clone();
			})
		})
	}
	function run() {
		var index = 0;
		var arr = Array.from(app.map.keys());
		var pic = app.map.get(arr[index]);
		var img = cacheFetch(pic);
		app.picture.innerHTML = app.base+"<img class='bottom' src="+img+"/>";
		app.latest.innerHTML = arr[index];
		highlight(arr[index]);
		var interval = setInterval(function() {
			index++
			if (arr[index] != undefined) {
				pic = app.map.get(arr[index]);
				img = cacheFetch(pic);
				console.log(cacheFetch(pic));
				app.picture.innerHTML = app.base+"<img class='bottom' src="+img+"/>";
				app.latest.innerHTML = arr[index];
				highlight(arr[index]);
			} else {
				clearInterval(interval);
			}
		}, 250);
	}
	function preloadImages(key) {
		caches.open("images").then(function(cache) {
			cache.match(key).then(function(f) {
				if (f == undefined) {
					console.warn("en ny bild");
					cache.add(key);
				} else {
					console.log("fanns");
				}
			})
		})
	}
	function getHistory(files) {
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
			var link = files[files.length-i].formats[0].link;
			var date = new Date(files[files.length-i].formats[0].updated).toLocaleString();
            app.map.set(date, link);
		}
	}
	function delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	function getRadar() {
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
				getHistory(files);
				activate();
			}
			var link = files[files.length-1].formats[0].link;
			var date2 = new Date(files[files.length-1].formats[0].updated).toLocaleString();
			if (app.map.size == 0 || !app.map.has(date2)) {
				app.piclink = link;
                app.map.set(date2, link);
			}
			table();
			app.picture.innerHTML = app.base+"<img class='bottom' src="+link+"/>";
			app.latest.innerHTML = date2;
			delay(100).then(function() {
				Array.from(app.map.keys()).forEach(function(f) {
					preloadImages(app.map.get(f));
				})
			})
		})
	}
	function timer() {
		var duration = 119;
		var timer = duration, minutes, seconds;
		app.intervals = setInterval(function () {
			minutes = parseInt(timer / 60, 10)
			seconds = parseInt(timer % 60, 10);
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
			app.timer.textContent = minutes + ":" + seconds;
			if (--timer < 0) {
				getRadar();
				timer = duration;
			}
		}, 1000);
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
	}
	function main() {

		document.querySelector(".button").addEventListener("click", function() {
			clear();
			clearInterval(app.intervals);
			timer();
			getRadar();
		});
		if (app.map.size == 0) {
			document.querySelector(".back").disabled = true;
			document.querySelector(".forward").disabled = true;
			document.querySelector(".run").disabled = true;
		} else {
			activate();
		}
		caches.delete("images").then(function() {
			console.log("clearing cache");
		});
	};
	main();
})();
