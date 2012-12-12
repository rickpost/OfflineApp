var db = false;

// Initialization functions
function onDeviceReady() {
	db = window.openDatabase("dbp_mobile", "1.0", "DBP Mobile App Database", 1000000);
	
	initializeDB();
}

// Database error handler
function dbError(err) {
	alert("Error processing SQL: "+err.code);
}

// Database success handler
function dbSuccess(err) {
}

// Database initial load
function initializeDB() {
	loadCategories();
}

// Load categories into the database
function loadCategories() {
	jQuery.post(
		getConnectorURL(),
		{
			action: 'get_categories'
		},
		function(result) {
			categories = result.categories;

			db.transaction(
				function (tx) {
					tx.executeSql("DROP TABLE IF EXISTS categories");
					tx.executeSql("CREATE TABLE IF NOT EXISTS categories(categoryid INTEGER, category TEXT)");

					for (i in categories) {
						console.log(categories[i].category);
						tx.executeSql("INSERT INTO categories(category) VALUES ('"+dbEscape(categories[i]['category'])+"')");
					}
				},
				dbError,
				dbSuccess
			)
		},
		'jsonp'
	)	
}

function getConnectorURL() {
	return 'http://192.168.1.33/sites/dairy/helper_scripts/mobile_connector.php'
}

// Browse retrieved products details
function browseProductsGo(products) {
	$.get(
		'product_row.html',
		function(row) {
			var content = "<table>";
			
			for (var i in products) {
				content += "<tr><td>"+products[i].product;
			}
			
			$('#main-area').html(content);
		},
		'html'
	)
}

function readTemplate() {
}

function showPage(pageName, callback) {
	$.get(
		pageName,
		function(content) {
			$('#main-area').html(callback(content));
		},
		'html');
}

// Show categories list
function showCategoriesList() {
	showPage('categories_list.html',
		function(content) {
			return content;
		}
	);
}

// Get a list of the products
function shop() {
	showCategoriesList();
}

function browseProducts() {
	jQuery.post(
		getConnectorURL(),
		{
			action: 'browse_products'
		},
		function(products) {
			browseProductsGo(products)
		},
		'jsonp'
	)
}

function success(entries) {
    var i;
    for (i=0; i<entries.length; i++) {
        console.log(entries[i].name);
    }
}

function fail(error) {
    alert("Failed to list directory contents: " + error.code);
}

function onPageLoadShop() {
	alert("Loaded");
}
