DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price FLOAT DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    PRIMARY KEY (item_id)
);


INSERT INTO products (product_name,department_name,price,stock_quantity) VALUE
("ExcelSteel Coffee cup","Home & kitchen", 10, 5),
("ExcelSteel Travel Mug","Home & kitchen", 15, 20),
("ExcelSteel Tea cup","Home & kitchen", 8, 15),
("Forever Blue dress","Clothes", 30, 30),
("Forever White short","Clothes", 15, 50),
("H&M hat","Clothes", 7, 20),
("Kate Mini handbag","Handbags", 35, 52),
("G&M Hair dryer","Electronics", 35, 50),
("AIR Mini fan","Electronics", 15, 45),
("Threshold Spring Form Pan","Home & kitchen", 10, 20);