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
                return ! (isNaN(input) || input < 0 || input >= Infinity);
            }
        }
    ]).then(function(ans){
            var query = "UPDATE products SET stock_quantity = stock_quantity+? WHERE item_id = ?";
            mysql_con.query(query,[ans.new_quantity,ans.id],function(err,results,fields){
                if(err) throw err;
                var query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE item_id = "+ans.id;
                showAllProducts(query);
            })
    })
}

function showAllProducts(show_query){
    mysql_con.query(show_query,function(err, results, fields){
        if(err) throw err;
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
        handleUser();
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
            var show_query = "SELECT item_id,product_name,price,stock_quantity FROM products";
            showAllProducts(show_query);
            break;
          case "View Low Inventory":
            var show_query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE stock_quantity <= 5";
            showAllProducts(show_query);
            break;
          case "Add to Inventory":
            updateStockQuantity();
            break;
          case "Add New Product":
            break;
        }
    });
}

mysql_con.connect(function(err){
    if(err) throw err;
    var show_query = "SELECT item_id,product_name,price,stock_quantity FROM products";
    showAllProducts(show_query);

})
