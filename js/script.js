$(function() {
	// функционал настройки
	$('span.tools').click(function() {
		$('.settings').slideToggle();
		if ($(this).css('background-position') == '0px 0px') {
			$(this).css({
				'transform': 'rotate(90deg)',
				'background-position': '0px -20px',
				'transition': 'transform .5s',
			});
		}
		else
			$(this).css({
				'transform': 'rotate(0deg)',
				'background-position': '0px 0px',
				'transition': 'transform .5s',
			});
	});
	


	// функционал wi-fi
	if (navigator.onLine) 
		$('span.wifi').css('background-position', '0px -15px');
	else
		$('span.wifi').css('background-position', '0px 0px');

	window.ononline = function() {
		$('span.wifi').css('background-position', '0px -15px');
	}
	window.onoffline = function() {
		$('span.wifi').css('background-position', '0px 0px');
	}

	// функционал навигации
	$('.navigator li').click(function() {
		if (!$(this).hasClass("nav")) {
			$('.navigator li').removeClass("nav");
			$(this).addClass("nav");
			$('.page').hide();
			$('.' + $(this).data("page")).show();
			localStorage.page = $(this).data("page");
			$('.main textarea').css('display', 'none');
			$('.file').css('background-position', '0px 0px');
			$('.navigator li span').css('background-position', '0px 0px');
			$('span', this).css('background-position', '0px -35px');
		}
	})

	if (localStorage.page)
		$('.navigator li').each(function() {
			if ($(this).data("page") == localStorage.page)
				$(this).click();
		})

	// функция показа списка
	$('span.file').click(function() {
		$(this).closest('.main').children('textarea').slideToggle();
		if ($(this).css('background-position') == '0px 0px')
			$(this).css('background-position', '0px -20px');
		else
			$(this).css('background-position', '0px 0px');
	})

	// функция показа textarea в note
	$('.footer .note').click(function() {
		$(this).hide();
		$(this).closest('.footer').children('textarea').show();
	})




	/* Обновление приложения */
	/*window.applicationCache.onchecking = function() {
		alert("Проверка наличия новой версии");
		return false;
	}
	window.applicationCache.onnoupdate = function() {
		alert("Версия приложения не изменилась");
		return false;
	}
	window.applicationCache.ondownloading = function() {
		alert("Загружается новая версия");
		return false;
	}
	window.applicationCache.oncached = function() {
		alert("Приложение загружено и установлено локально");
		return false;
	}
	window.applicationCache.onupdatereagy = function() {
		alert("Была загружена новая версия приложения. Перезапустите его.");
		return false;
	}
	window.applicationCache.onerror = function() {
		alert("Невозможно загрузить файл объявления или сохранить приложение в кэш");
		return false;
	}
	window.applicationCache.onobsolete = function() {
		alert("Это приложение больше не кэшируется. Перезапустите его, чтобы получить последнюю версию из сети");
		return false;
	}*/



	/* Работа приложения */

	var label = ' +';


	var preferences = {
		'range': '-1',
		'sort': true,
		'visibel': true,
		'note': true,  
	}
	var note = {
		'page1': '',
		'page2': '',
		'page3': '',
	}
	var goods = {
		page1: {
			'товар1': '3,0',
			'товар2': '1,0',
			'товар3': '5,0',
			'товар4': '2,0',
			'товар5': '4,0',
			'товар6': '6,0',
			'товар7': '2,6',
		},
		page2: {
			'товар1': '3,0',
			'товар2': '1,0',
			'товар3': '5,0',
			'товар4': '2,0',
		},
		page3: {
			'товар1': '3,0',
			'товар2': '1,0',
		},
	};

	

	if ('preferences' in localStorage)
		preferences = JSON.parse(localStorage.preferences);
	if ('goods' in localStorage)
		goods = JSON.parse(localStorage.goods);
	if ('note' in localStorage)
		note = JSON.parse(localStorage.note);


	$('input[type="range"]').val(preferences.range);
	$('input[type="checkbox"]:eq(0)').get(0).checked = preferences.sort;
	$('input[type="checkbox"]:eq(1)').get(0).checked = preferences.visibel;
	$('input[type="checkbox"]:eq(2)').get(0).checked = preferences.note;

	goods_textarea('page1');
	goods_textarea('page2');
	goods_textarea('page3');
	info('page1');
	info('page2');
	info('page3');
	goods_table('page1');
	goods_table('page2');
	goods_table('page3');
	sort_rows();
	display_rows();

	note_textarea('page1');
	note_textarea('page2');
	note_textarea('page3');
	note_div('page1');
	note_div('page2');
	note_div('page3');
	display_note();


	$('.footer textarea').change(function() {
		var page = $(this).data("page");
		textarea_note(page);
		note_textarea(page);
		note_div(page);
		$(this).hide();
		$(this).closest('.footer').children('.note').show();

	})

	$('.main textarea').change(function() {
		var page = $(this).data("page");
		textarea_goods(page);
		goods_textarea(page);
		goods_table(page);
		info(page);
		sort_rows();
		display_rows();
	})

	$('input[type="range"]').change(function() {
		sort_rows();
		display_rows();
		preferences.range = $(this).val();
		localStorage.preferences = JSON.stringify(preferences);
	})

	$('input[type="checkbox"]:eq(0)').change(function() {
		preferences.sort = this.checked;
		localStorage.preferences = JSON.stringify(preferences);
		sort_rows();
	})

	$('input[type="checkbox"]:eq(1)').change(function() {
		preferences.visibel = this.checked;
		localStorage.preferences = JSON.stringify(preferences);
		display_rows();
	})

	$('input[type="checkbox"]:eq(2)').change(function() {
		preferences.note = this.checked;
		localStorage.preferences = JSON.stringify(preferences);
		display_note();	
	})

	function display_rows() {
		if ($('input[type="checkbox"]:eq(1)').get(0).checked == true)
			$('tr.row').hide();
		else
			$('tr.row').show();
	}


	function sort_rows() {
		for (i = 1; i <= 3; i++) {
			var page = 'page' + i;

			if ($('input[type="range"]').val() == 0) {
				goods_table(page);
			}

			if ($('input[type="range"]').val() == 1 || $('input[type="range"]').val() == -1) {
				var array = $('.' + page + ' table tr').toArray();
				array.sort(function(row1, row2) {
					var cell1 = $(row1).children('td:eq(1)').text().replace(',', '.');
					var cell2 = $(row2).children('td:eq(1)').text().replace(',', '.');
					if (Number(cell1) < Number(cell2)) 
						return $('input[type="range"]').val();
					else if (Number(cell1) > Number(cell2))
						return -($('input[type="range"]').val());
					else return 0;
				})
				for (j = 0; j < array.length; j ++)
					$('.' + page + ' table').append(array[j]);
			}

			if ($('input[type="checkbox"]:eq(0)').get(0).checked == true) {
				var array = $('.' + page + ' table tr');
				array.each(function() {
					if ($(this).hasClass('row'))
						$('.' + page + ' table').append(this);
				})
			}
		}
	};

	function goods_table(page) {
		var table = $('.' + page + ' table').html('');
		for (name in goods[page]) {
			var row = $('<tr>').click(function() {
			$(this).toggleClass('row');
			var property = ($(this).children('td:first').text());
			if ($(this).hasClass('row'))
				goods[page][property] = goods[page][property] + label;
			else 
				goods[page][property] = goods[page][property].replace(label, '');
			goods_textarea(page);
			info(page);
			sort_rows();
			display_rows();
			localStorage.goods = JSON.stringify(goods);
			});
			var cell1 = $('<td>').text(name);
			var cell2 = $('<td>').text(goods[page][name].replace(label, ''));
			if (goods[page][name].indexOf(label) !== -1)
				row.addClass('row');
			row.append(cell1).append(cell2);
			table.append(row);
		}
	};

	function goods_textarea(page) {
		var text = $('.' + page + ' .main textarea');
		var str = "";
		for (name in goods[page])
			str += name + " - " + goods[page][name] + "\n";
		text.val(str);
	};

	function	info(page) {
		var number = $('.' + page + ' span:eq(0)');
		var price = $('.' + page + ' span:eq(1)');
		var n = 0, pr = 0;
		for (name in goods[page])
			if (goods[page][name].indexOf(label) == -1) {
				n++;
				pr += parseFloat(goods[page][name].replace(',', '.'));
			} 
		pr = pr.toFixed(2).replace(".", ",");
		if (n == 0) n = "";
		if (pr == "0,00") pr = "";
		number.text(' ' + n);
		price.text(' ' + pr);
	};

	function textarea_goods(page) { 
		var text = $('.' + page + ' .main textarea');
		var arr = text.val().split("\n");
		goods[page] = {};
		for (i = 0; i < arr.length; i++) {
			if (arr[i].indexOf("-") == -1) continue;
			var good = arr[i].split("-")[0].trim();
			var price = arr[i].split("-")[1].trim();
			goods[page][good] = price;
			localStorage.goods = JSON.stringify(goods);
		}
	};


	function textarea_note(page) { 
		var text = $('.' + page + ' .footer textarea');
		note[page] = text.val();
		localStorage.note = JSON.stringify(note);
	};
	
	function note_textarea(page) {
		var text = $('.' + page + ' .footer textarea');
		text.val(note[page]);
	};

	function note_div(page) {
		var div = $('.' + page + ' .note');
		div.html('');
		var arr = note[page].split("\n");
		for (i = 0; i < arr.length; i++) {
			var p = $('<p>').text(arr[i].trim());
			div.append(p);
		}
		if (div.text() == '')
			div.html('<p>Записей нет<p>');
	}

	function display_note() {
		if ($('input[type="checkbox"]:eq(2)').get(0).checked == true)
			$('.footer').hide();
		else {
			$('.footer').show();
			$('.footer .note').show();
			$('.footer textarea').hide();
		}
	}

});