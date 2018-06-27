# bamazon
This is an Amazon-like command line project. It allows customer place order, print out the receipt and reduce the quantity of sold product. As a seller (manager), you can view, update and add new products to database. 


### How to install:

* Install Node.js and npm in your laptop.
* In your terminal, run "git clone https://github.com/gugucode/bamazon.git" to download application.
* Or Download from https://github.com/gugucode/bamazon.git manually.
* After download, in your terminal, run "npm install" inside the bamazon folder that has package.json to install dependend packages.
* Install mySql 8.0 and start the mySql server. Run "mysql -u user_name -p < bamazon.sql" on terminal to create "bamazon" database and "products" table. Also, it will insert some dummy data into database for your test.
* Modify host, port, user, and password in mysqlConf.js if they are different from yours. This file contains your database's access info.

### How to use bamazon
* **node bamazonCustomer.js**
    * This will print the id, name, and price of all products and ask customer what they want to buy.
    * After enter the product's id and quantity, it will print a receipt.
    * If the product's quantity is not enough, it will say "Insufficient quantity!".
    * Customer can hit "control + c" together to exit the program.

```
basementoffice:bamazon Limeng$ node bamazonCustomer.js 
(node:7768) [DEP0096] DeprecationWarning: timers.unenroll() is deprecated. Please use clearTimeout instead.
----------------------------------------------------------------------------------------------------
ID              Item Name                                             Price                         
----------------------------------------------------------------------------------------------------
1               ExcelSteel Coffee cup                                 10                            
2               ExcelSteel Travel Mug                                 15                            
3               ExcelSteel Tea cup                                    8                             
4               Forever Blue dress                                    30                            
5               Forever White short                                   15                            
6               H&M hat                                               7                             
7               Kate Mini handbag                                     35                            
8               G&M Hair dryer                                        35                            
9               AIR Mini fan                                          15                            
10              Threshold Spring Form Pan                             10                                
----------------------------------------------------------------------------------------------------


? Which product that you want to purchase? Please enter its ID. 1
? How many do you want to order? 100
Insufficient quantity!


? Which product that you want to purchase? Please enter its ID. 1
? How many do you want to order? 2

ExcelSteel Coffee cup                    $10 x 2
-------------------------------------------------
                                       Total: $20
```

* **node bamazonManager.js**
    * View Products for Sale -- print all products' informations.
    * View Low Inventory -- print products' information if their quantities is less than 6.
    * Add to Inventory -- ask for product's id and quantity that Manager wants to add, then update database and print the updated row.
    * Add New Product -- ask for new product's info and insert into "products" table. If product exists, don't add that product to database.

```
basementoffice:bamazon Limeng$ node bamazonManager.js 
(node:7807) [DEP0096] DeprecationWarning: timers.unenroll() is deprecated. Please use clearTimeout instead.
----------------------------------------------------------------------------------------------------
ID              Item Name                                             Price          Quantity       
----------------------------------------------------------------------------------------------------
1               ExcelSteel Coffee cup                                 10             89             
2               ExcelSteel Travel Mug                                 15             975            
3               ExcelSteel Tea cup                                    8              27             
4               Forever Blue dress                                    30             30             
5               Forever White short                                   15             50             
6               H&M hat                                               7              20             
7               Kate Mini handbag                                     35             52             
8               G&M Hair dryer                                        35             50             
9               AIR Mini fan                                          15             15             
10              Threshold Spring Form Pan                             10             5                      
----------------------------------------------------------------------------------------------------


? What do you want to do? View Low Inventory
----------------------------------------------------------------------------------------------------
ID              Item Name                                             Price          Quantity       
----------------------------------------------------------------------------------------------------
10              Threshold Spring Form Pan                             10             5                       
----------------------------------------------------------------------------------------------------


? What do you want to do? Add to Inventory
? Which item that you want to update the quantity? Please enter the item ID. 1
? How many do you want to add? 5
----------------------------------------------------------------------------------------------------
ID              Item Name                                             Price          Quantity       
----------------------------------------------------------------------------------------------------
1               ExcelSteel Coffee cup                                 10             94             
----------------------------------------------------------------------------------------------------


? What do you want to do? View Products for Sale
----------------------------------------------------------------------------------------------------
ID              Item Name                                             Price          Quantity       
----------------------------------------------------------------------------------------------------
1               ExcelSteel Coffee cup                                 10             94             
2               ExcelSteel Travel Mug                                 15             975            
3               ExcelSteel Tea cup                                    8              27             
4               Forever Blue dress                                    30             30             
5               Forever White short                                   15             50             
6               H&M hat                                               7              20             
7               Kate Mini handbag                                     35             52             
8               G&M Hair dryer                                        35             50             
9               AIR Mini fan                                          15             15             
10              Threshold Spring Form Pan                             10             5                       
----------------------------------------------------------------------------------------------------


? What do you want to do? Add New Product
? What is the name of new product? Java book
? Which department? Others
? What is the unit price of new product? 30
? What is the quantity? 28
New product is added to database.
----------------------------------------------------------------------------------------------------
ID              Item Name                                             Price          Quantity       
----------------------------------------------------------------------------------------------------
17              Java book                                             30             28             
----------------------------------------------------------------------------------------------------


```

### Built With  

* Javascript 
* Node.js: mysql and inquirer
* MySql database server


### Contributing

Please contact Erin at meiyuechang@gmail.com for details on our code of conduct, and the process for submitting pull requests to us.

### Authors

* **Erin Mei** - *Initial work* - [Portfolio](https://gugucode.github.io/mysite/)

