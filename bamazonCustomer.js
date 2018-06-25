var mysql = require("mysql");
var inq = require("inquirer");
var last_id = 0;

var mysql_con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})


function updateStockQuantity(id,quantity){
    var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
    mysql_con.query(query,[quantity,id],function(err,results,fields){
        if(err) throw err;
    })
}

function showAllProducts(){
    var show_query = "SELECT item_id,product_name,price FROM products";
    mysql_con.query(show_query,function(err, results, fields){
        if(err) throw err;
        console.log("-".repeat(100));
        console.log("ID"+" ".repeat(31)+ "Item Name"+ " ".repeat(24) + "Price" + " ".repeat(28));
        console.log("-".repeat(100));
        results.forEach(elem => {
            var id = elem.item_id + " ".repeat(33-elem.item_id.toString().length);
            var name = elem.product_name + " ".repeat(33-elem.product_name.length);
            var price = elem.price + " ".repeat(33-elem.price.toString().length);
            console.log(id + name + price)
        });
        console.log("-".repeat(100)+"\n\n");

        last_id = results[results.length - 1].item_id;
        handleUser();
    })
    
}

function printReceipt(ans){
    var query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE item_id = ? AND stock_quantity >= ? ";
    mysql_con.query(query, [ans.id,ans.quantity],function(err, results, fields){
        if(err) throw err;
        if(results.length){
            var r = results[0];
            var expression = "\n" + r.product_name + " ".repeat(20)+ "$" + r.price + " x " + ans.quantity;
            console.log(expression);
            console.log("-".repeat(expression.length));
            var total = "Total: $" + (r.price*ans.quantity);
            console.log(" ".repeat(expression.length - total.length)+total + "\n\n");

            updateStockQuantity(ans.id, r.stock_quantity - ans.quantity);
        }else{
            console.log("Insufficient quantity!\n\n");
        }

        handleUser();
    });
}

function handleUser(){
    inq.prompt([
        {
            name: "id",
            message: "Which product that you want to purchase? Please enter its ID.",
            validate: function(input){
                input = parseInt(input);
                return ! (isNaN(input) || input <= 0 || input > last_id);
            }
        },
        {
            name: "quantity",
            message: "How many do you want to order?",
            validate: function(input){
                input = parseInt(input);
                return ! (isNaN(input) || input <= 0 );
            }
        }
    
    ]).then(function(ans){
        printReceipt(ans);
    });
}

mysql_con.connect(function(err){
    if(err) throw err;
    showAllProducts();

})

