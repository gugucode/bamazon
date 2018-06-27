

var mysql = require("mysql");
var mysql_conf = require("./mysqlConf.js");
var inq = require("inquirer");
var last_id = 0;   // The id of last row in products table

// MySql queries
var show_query = "SELECT item_id,product_name,price FROM products";
var update_quantity_query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
var find_product_query = "SELECT product_name,price,stock_quantity FROM products WHERE item_id = ? AND stock_quantity >= ? ";

// datebase connection info
var mysql_con = mysql.createConnection(mysql_conf.mysql_obj)

// reduce product's quantity in database
function updateStockQuantity(id, quantity){
    mysql_con.query(update_quantity_query, [quantity, id], (err, results, fields)=>{
        if(err) throw err;
    })
}

// print all products info 
function showAllProducts(){
    mysql_con.query(show_query, (err, results, fields)=>{
        if(err) throw err;
        console.log("-".repeat(100));
        console.log("ID"+" ".repeat(14)+ "Item Name"+ " ".repeat(45) + "Price" + " ".repeat(25));
        console.log("-".repeat(100));
        results.forEach(elem => {
            var id = elem.item_id + " ".repeat(16 - elem.item_id.toString().length);
            var name = elem.product_name + " ".repeat(54 - elem.product_name.length);
            var price = elem.price + " ".repeat(30 - elem.price.toString().length);
            console.log(id + name + price)
        });
        console.log("-".repeat(100) + "\n\n");

        // save the id of the last row in products table
        last_id = results[results.length - 1].item_id;  
        // Ask what user wants to do next
        handleUser();
    })   
}

// print out the user's order receipt
function printReceipt(ans){
    mysql_con.query(find_product_query, [ans.id, ans.quantity],(err, results, fields)=>{
        if(err) throw err;
        if(results.length > 0){
            var r = results[0];
            var expression = "\n" + r.product_name + " ".repeat(20)+ "$" + r.price + " x " + ans.quantity;
            console.log(expression);
            console.log("-".repeat(expression.length));
            var total = "Total: $" + (r.price * ans.quantity);
            console.log(" ".repeat(expression.length - total.length) + total + "\n\n");

            // Update product's quantity
            updateStockQuantity(ans.id, ans.quantity);
        }else{
            console.log("Insufficient quantity!\n\n");
        }

        // Ask what user wants to do next
        handleUser();
    });
}

// ask which product that user wants to purchase
function handleUser(){
    inq.prompt([
        {
            name: "id",
            message: "Which product that you want to purchase? Please enter its ID.",
            validate: function(input){
                input = parseInt(input);
                // User input needs to be integer and has to be a valid id
                return ! (isNaN(input) || input > last_id || input <= 0);
            }
        },
        {
            name: "quantity",
            message: "How many do you want to order?",
            validate: function(input){
                input = parseInt(input);
                // User input needs to be integer and cannot less than 0
                return ! (isNaN(input) || input < 0 );
            }
        }   
    ]).then((ans)=>{
        printReceipt(ans);
    });
}

// connect to database and start our application
mysql_con.connect((err)=>{
    if(err) throw err;
    showAllProducts();
})

