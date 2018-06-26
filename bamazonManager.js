var mysql = require("mysql");
var inq = require("inquirer");
var last_id = 0;


var show_all_query = "SELECT item_id,product_name,price,stock_quantity FROM products";
var addNewProduct_query = "INSERT INTO products (product_name,department_name,price,stock_quantity) VALUE (?,?,?,?)";
var updateStockQuantity_query = "UPDATE products SET stock_quantity = stock_quantity+? WHERE item_id = ?";
var low_inventory_query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE stock_quantity <= 5";
var search_by_id_query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE item_id = ?";
var search_by_name_dep_query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE product_name = ? and department_name = ?";

var mysql_con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

function addProduct(ans){
    mysql_con.query(search_by_name_dep_query,[ans.name,ans.department], function(err,results,fields){
        if(err) throw err;
        if(results.length == 0){
            mysql_con.query(addNewProduct_query,[ans.name,ans.department,ans.price,ans.quantity],function(err,results,fields){
                if(err) throw err;
                console.log("New product is added to database.")
                var query = search_by_name_dep_query.replace("?","'" + ans.name + "'").replace("?","'" + ans.department + "'");
                showAllProducts(query);
            })
        }else{
            console.log("This product is already existed.")
            printProducts(results);
            handleUser();
        }
    })
}

function addNewProduct(){
    inq.prompt([
        {
            name: "name",
            message: "What is the name of new product?",
            validate: function(input){
                return input != "";
            }
        },
        {
            name: "department",
            message: "Which department?",
            type: "list",
            choices: ["Home & kitchen","Clothes","Handbags","Shoes","Electronics","Beauty","Garden","Others"],
        },
        {
            name: "price",
            message: "What is the unit price of new product?",
            validate: function(input){
                input = parseFloat(input);
                return ! (isNaN(input)) || input >= 0;
            }
        },
        {
            name: "quantity",
            message: "What is the quantity?",
            validate: function(input){
                input = parseInt(input);
                return ! isNaN(input) || input >= 0;
            }
        },

    ]).then(function(ans){
        addProduct(ans);            
    })
}

function updateStockQuantity(){
    inq.prompt([
        {
            name: "id",
            message: "Which item that you want to update the quantity? Please enter the item ID.",
            validate: function(input){
                input = parseInt(input);
                return ! (isNaN(input)) || input > 0 || input <= last_id;
            }
        },
        {
            name: "new_quantity",
            message: "How many do you want to add?",
            validate: function(input){
                input = parseInt(input);
                return ! (isNaN(input)) || input >= 0 || input < Infinity;
            }
        }
    ]).then(function(ans){
            mysql_con.query(updateStockQuantity_query,[ans.new_quantity,ans.id],function(err,results,fields){
                if(err) throw err;
                showAllProducts(search_by_id_query.replace("?","'" + ans.id + "'"));
            })
    })
}

function printProducts(results){
    console.log("-".repeat(100));
    console.log("ID"+" ".repeat(14)+ "Item Name"+ " ".repeat(45) + "Price" + " ".repeat(10) + "Quantity" + " ".repeat(7));
    console.log("-".repeat(100));
    results.forEach(elem => {
        var id = elem.item_id + " ".repeat(16-elem.item_id.toString().length);
        var name = elem.product_name + " ".repeat(54-elem.product_name.length);
        var price = elem.price + " ".repeat(15-elem.price.toString().length);
        var quantity = elem.stock_quantity + " ".repeat(15-elem.stock_quantity.toString().length);
        console.log(id + name + price + quantity);
    });
    console.log("-".repeat(100)+"\n\n");

    last_id = results[results.length - 1].item_id;
}

function showAllProducts(show_query){
    mysql_con.query(show_query,function(err, results, fields){
        if(err) throw err;
        if(results.length > 0){
            printProducts(results);
            handleUser();
        }
    })
}

function handleUser(){
    inq.prompt([
        {
            name: "choice",
            message: "What do you want to do?",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        }
    ]).then(function(ans){
        switch(ans.choice){
          case "View Products for Sale":
            showAllProducts(show_all_query);
            break;
          case "View Low Inventory":
            showAllProducts(low_inventory_query);
            break;
          case "Add to Inventory":
            updateStockQuantity();
            break;
          case "Add New Product":
            addNewProduct();
            break;
        }
    });
}

mysql_con.connect(function(err){
    if(err) throw err;
    showAllProducts(show_all_query);

})
