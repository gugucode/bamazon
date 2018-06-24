var mysql = require("mysql");

var mysql_con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

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
    })
}

mysql_con.connect(function(err){
    if(err) throw err;
    showAllProducts();
    mysql_con.end();
})