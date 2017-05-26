function load() {
	var products = document.getElementById("products");

	var menu = products.firstElementChild;
	var body = products.lastElementChild;

	var settings = body.children[0];
	var container = body.children[1];
	var down = body.children[2];

	var number = menu.getElementsByTagName("span")[0];
	var price = menu.getElementsByTagName("span")[1];
	var head = menu.getElementsByTagName("a")[0];
	var prefer = menu.getElementsByTagName("a")[1];

	var range = settings.children[0];
	var sort = settings.children[1].children[0];
	var del = settings.getElementsByTagName("a")[0];
	var checked = settings.getElementsByTagName("a")[1];
	var change = settings.getElementsByTagName("a")[2];

	var textarea = container.firstElementChild;
	var div_table = container.lastElementChild;

	var down_number = down.getElementsByTagName("span")[0];
	var down_display = down.getElementsByTagName("a")[0];

	var label = ' +';
	var goods = {
		'товар1': '3,0 +',
		'товар2': '1,0 +',
		'товар3': '5,0',
		'товар4': '2,0',
		'товар5': '4,0',
		'товар6': '6,0 +',
		'товар7': '2,6',
	}
	var preferences = {
		'range': '1',
		'sort': true,  
	}
	var visible = true;

	// Загрузка данных из памяти браузера
	if ('preferences' in localStorage)
		preferences = JSON.parse(localStorage.preferences);
	if ('goods' in localStorage)
		goods = JSON.parse(localStorage.goods);

	// Настройка параметров
	range.value = preferences.range;
	sort.checked = preferences.sort;
	body.style.display = "block";
	settings.style.display = "none";
	prefer.style.display = "inline-block";
	textarea.style.display = "none";



	goods_textarea();
	goods_table();
	info();
	sort_rows();
	display_rows();


	textarea.onchange = function() {
		textarea_goods();   					
		goods_textarea();  				 
		goods_table();     				 
		info();                                    
		sort_rows();          					
		display_rows();					                  
	}
	range.onchange = function() {  
		sort_rows();
		display_rows(); 
		preferences.range = +this.value;
		localStorage.preferences = JSON.stringify(preferences);
	}
	sort.onchange = function() {
		sort_rows();
		display_rows();
		preferences.sortdown = +this.checked;
		localStorage.preferences = JSON.stringify(preferences);
	}
	down_display.onclick = function() {
		if (visible == true)
			visible = false;
		else
			visible = true;
		display_rows();
		return false;
	}
	head.onclick = function() {
		if (body.style.display == "block") {
			body.style.display = "none";
			prefer.style.display = "none";
			settings.style.display = "none";
			div_table.style.display = "block";
			textarea.style.display = "none";
		}
		else {
			body.style.display = "block";
			prefer.style.display = "inline-block";
		}
		return false;
	}
	prefer.onclick = function() {
		if (settings.style.display == "none")
			settings.style.display = "block";
		else
			settings.style.display = "none";
		return false;
	}
	change.onclick = function() {
		if (textarea.style.display == "none") {
			textarea.style.display = "block";
			this.innerHTML = "Сохранить";
			div_table.style.display = "none";
		}
		else {
			textarea.style.display = "none";
			div_table.style.display = "block";
			this.innerHTML = "Редактировать";
		}
		return false;
	}
	checked.onclick = function() {
		checked_rows();
		return false;
	}
	del.onclick = function() {
		del_rows();
		return false;
	}

	function del_rows() {
		if (del.style.color == "green" && confirm("Удалить выделеные строки?")) {
			for (p in goods) {
				if (goods[p].indexOf(label) !== -1)
					delete goods[p];
			};
			localStorage.goods = JSON.stringify(goods);
			visible = true;
			goods_textarea();
			goods_table();
			info();
			sort_rows();
			display_rows();
		}
	};

	function checked_rows() {
		if (checked.style.color == "green" && confirm("Снять выделение строк?")) {
			for (p in goods) {
				if (goods[p].indexOf(label) !== -1)
					goods[p] = goods[p].replace(label, "");
			}
			localStorage.goods = JSON.stringify(goods);
			visible = true;
			goods_textarea();
			goods_table();
			info();
			sort_rows();
			display_rows();
		}
	};

	function display_rows() {
		var tbody = container.lastElementChild;              
		var rows = tbody.getElementsByTagName("tr");        

		if (visible == true) {                   
			var n = 0;
			for (row in rows) {                             
				if (rows[row].firstElementChild) {
					var input = rows[row].lastElementChild     
						.firstElementChild;
					if (input.checked == true) {
						rows[row].style.display = "none";        
						n++;
					} 				  		
				}
			}
			down_number.style.display = "inline-block";
			down_display.innerHTML = "Показать";
			if (n == 0) {
				del.style.color = "red";
				checked.style.color = "red";
				down_display.innerHTML = "";
				n = "";
			}
			else {
				down_display.innerHTML = "Показать";
				del.style.color = "green";
				checked.style.color = "green";
			}
			down_number.innerHTML = n;
		} 
		else { 
			var n = 0;                                         
			for (row in rows) {
				if (rows[row].firstElementChild) {
					rows[row].style.display = "block";          
					var input = rows[row].lastElementChild     
						.firstElementChild;
					if (input.checked == true)
						n++;
				}
			}
			if (n == 0) {
				down_display.innerHTML = "";
			}
			else {
				down_number.style.display = "none";
				down_display.innerHTML = "Скрыть";
			}
		}
	};

	function sort_rows() {
		if (range.value == 0) {											       /* Сортировка обычная */
			goods_table();           
		}
		var tbody = div_table.lastElementChild;                      /* Выбираем таблицу */
		var rows = tbody.getElementsByTagName("tr");                 /* Выбираем из таблицы строки */
		rows = Array.prototype.slice.call(rows, 0);                  /* Записываем все строки в массив */

		if (range.value == '1' || range.value == '-1') {             /* Сортировка по возрастанию или убыванию */
			rows.sort(function(row1, row2) {
				var cell1 = row1.getElementsByTagName("td")[1];        /* Сравниваются ячейки с ценой */
				var cell2 = row2. getElementsByTagName("td")[1];
				var val1 = cell1.textContent;
				var val2 = cell2.textContent;
				if (val1 < val2) return range.value;                   /* Крайнее левое положение - по убыванию */
				else if (val1 > val2) return -(range.value);           /* Крайнее правое положение - по возрастанию */
				else return 0;
			})
			for (i = 0; i < rows.length; i++)                         /* Заменяем все строки в таблице */
				tbody.appendChild(rows[i]);
		}

		if (sort.checked == true) {                                  /* Если перемещение выделенных строк вниз активна */
			var frag = document.createDocumentFragment();             /* Создание пустого элемента-контейнера */
			for (row = 0; row < rows.length; row++) {                 /* Цикл по всем строкам */
				var cell = rows[row].getElementsByTagName("td")[2];    /* Выбираем в строке ячейку с checkbox */
				if (cell.firstElementChild.checked == true)            /* Если checkbox отмечен, то */
					frag.appendChild(rows[row]);                        /* помещаем данную строку в элемент-контейнер */
			}
			tbody.appendChild(frag);	                               /* все отмеченные строки добавляем в конец таблицы */
		}
	};

	function goods_textarea() {
		var string = "";
		for (name in goods)
			string += name + " - " + goods[name] + "\n";
		textarea.value = string;
	};

	function goods_table() {
		div_table.removeChild(div_table.firstElementChild);              /* Удаляю таблицу */
		var table = document.createElement("table");                    /* Создаю таблицу */
		for (name in goods) { 
			var tr = document.createElement("tr");                       /* Создаю строку */
			var property = document.createElement("td");                 /* Создаю первую ячейку */
			var price = document.createElement("td");                    /* Создаю вторую ячейку */	
			var checkbox = document.createElement("td");                 /* Создаю третью ячейку */   					
			var nameText = document.createTextNode(name);                /* Текст для первой ячейки */
			var priceText = document.createTextNode(goods[name]          /* Цена для второй ячейки */
				.replace(label, ""));             
			var input = document.createElement("input");                 /* Элемент input для третьей ячейки*/
			input.type = "checkbox";                                     /* с типом checkbox */

			if (goods[name].indexOf(label) !== -1)                       /* Если в цене присуствует метка, */
				input.checked = "checked";                                /* то сделать checkbox активным */

			input.onchange = function() {                                /* Функция обработчик события checked */
				var p = this.parentNode.parentNode                        /* Определяет название товара в котором */
					.firstElementChild.innerHTML;                          /* произошло событие */
				if (goods[p].indexOf(label) == -1)                        /* Если в данном товаре отсуствует метка */
					goods[p] = goods[p] + label;                           /* то добавить её к цене товара */
				else                                                      /* Если метка присуствует, то убрать её */
					goods[p] = goods[p].replace(label, "");

				localStorage.goods = JSON.stringify(goods);
				goods_textarea();                            
				info();
				sort_rows();
				display_rows();
			};

			property.appendChild(nameText);    /* Добавление текста в первую ячейки */	
			price.appendChild(priceText);      /* Добавление цены во вторую ячейку */
			checkbox.appendChild(input);       /* Добавление элемента input в третью ячейку */
			tr.appendChild(property);          /* Добавляю первую ячейку в строку */
			tr.appendChild(price);             /* Добавляю вторую ячейку в строку */			
			tr.appendChild(checkbox);          /* Добавляю третью ячейку в строку */
			table.appendChild(tr);             /* Добавляю строку в таблицу */
		}
		div_table.appendChild(table);         /* Добавляю таблицу в container */	
	};

	function textarea_goods() { 
		var arr = textarea.value.split("\n");
		goods = {};
		for (i = 0; i < arr.length; i++) {
			if (arr[i].indexOf("-") == -1) continue;
			var good = arr[i].split("-")[0].trim();
			var price = arr[i].split("-")[1].trim();
			goods[good] = price;
			localStorage.goods = JSON.stringify(goods);
		}
	};

	function	info() {
		var n = 0, pr = 0;
		for (name in goods)
			if (goods[name].indexOf(label) == -1) {
				n++;
				pr += parseFloat(goods[name].replace(',', '.'));
			} 
		pr = pr.toFixed(2).replace(".", ",");
		if (n == 0) n = "";
		if (pr == "0,00") pr = "";
		number.innerHTML = n;
		price.innerHTML = pr;
	};
};

