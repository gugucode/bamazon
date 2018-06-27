var mysql = require("mysql");
var mysql_conf = require("./mysqlConf.js");
var inq = require("inquirer");

// MySql queries
var show_all_query = "SELECT item_id,product_name,price,stock_quantity FROM products";
var addNewProduct_query = "INSERT INTO products (product_name,department_name,price,stock_quantity) VALUE (?,?,?,?)";
var updateStockQuantity_query = "UPDATE products SET stock_quantity = stock_quantity+? WHERE item_id = ?";
var low_inventory_query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE stock_quantity <= 5";
var search_by_id_query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE item_id = ?";
var search_by_name_dep_query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE product_name = ? and department_name = ?";

// datebase connection 
var mysql_con = mysql.createConnection(mysql_conf.mysql_obj)

// add new product to products table
function addProduct(ans){
    mysql_con.query(search_by_name_dep_query, [ans.name, ans.department], (err, results,fields)=>{
        if(err) throw err;
        if(results.length == 0){ // If the product doesn't exist, add it to the products table
            mysql_con.query(addNewProduct_query,[ans.name,ans.department,ans.price,ans.quantity],(err,results,fields)=>{
                if(err) throw err;
                console.log("New product is added to database.")
                var query = search_by_name_dep_query.replace("?","'" + ans.name + "'").replace("?","'" + ans.department + "'");
                showAllProducts(query);
            })
        }else{ //Else, don't add the product and let the user know product exists.
            console.log("The products table has already have this product.")
            printProducts(results);
            handleUser();
        }
    })
}

// Get product's info from user and save it.
function addNewProduct(){
    inq.prompt([
        {
            name: "name",
            message: "What is the name of new product?",
            validate: function(input){  
                // product's name cannot be empty
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
                // input has to be an integer and greater than or equal to 0
                return ! (isNaN(input)) || input >= 0;
            }
        },
        {
            name: "quantity",
            message: "What is the quantity?",
            validate: function(input){
                input = parseInt(input);
                return ! (isNaN(input) || input < 0);
            }
        },

    ]).then(function(ans){
        // add new product to database
        addProduct(ans);            
    })
}

// Update product's quantity
function updateStockQuantity(){
    inq.prompt([
        {
            name: "id",
            message: "Which item that you want to update the quantity? Please enter the item ID.",
            validate: function(input){
                input = parseInt(input);
                return ! (isNaN(input) || input <= 0);
            }
        },
        {
            name: "new_quantity",
            message: "How many do you want to add?",
            validate: function(input){
                input = parseInt(input);
                return ! (isNaN(input) || input < 0 || input > Infinity);
            }
        }
    ]).then(function(ans){
        // use updateStockQuantity_query to add product's quantity 
        mysql_con.query(updateStockQuantity_query,[ans.new_quantity,ans.id],(err,results,fields)=>{
            if(err) throw err;
            showAllProducts(search_by_id_query.replace("?","'" + ans.id + "'"));
        })
    })
}

// print selected products 
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
}

function showAllProducts(show_query){
    mysql_con.query(show_query,(err, results, fields)=>{
        if(err) throw err;
        if(results.length > 0){
            printProducts(results);
        }else{
            console.log("Sorry, we cannot find the product.\n");
        }
        handleUser();
    })
}

// Let manager/seller choose what they like to do
function handleUser(){
    inq.prompt([
        {
            name: "choice",
            message: "What do you want to do?",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        }
    ]).then((ans)=>{
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

mysql_con.connect((err)=>{
    if(err) throw err;
    showAllProducts(show_all_query);

})
