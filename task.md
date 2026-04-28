Analysis the schema.psql and api file

You're going to create a full satck restaurant website to handle restaurant order management ,sale , product show, discount, customer management, payment and order store, review store and support system using next js , javascript, api in next router api and postgresql.

this is a project of a saas web service provider company and subscription based.


firstly fetch the tenants details from the database by domain and store in the fronend for data fetching.
use /api/routes.js and usestate to store data
 if the tenant status is active and website is active then show the website open else show the status. 
create api and fix ui for
1. Create register, login, logout and update profile


2. admin panel:
    1. see business overview in  the main page (/dashboard/admin/page.jsx)
    2. admin can promote user role to (manager, sales) analysis , purchase list, payment list, delivered orders view
3. manager panel:
    1. create, update, delete categories, items
    2. manage expenses, view delivered orders, reservation, view review in list in a page, can delete review reviews
4. sales panel:
    1. create purchase, recieve pending order or cancel
    2. deliver pending orders


5. user can add items to cart, and then can place order and this appear as pending order in the sales page

after recieving the pending orders by sales then create payment and mark as accecpted. then appear the accepted in another page for deliver. when the order is ready to servfe then sales can deliver the order

. user can update their profile information in /user/setting
view orders in /users/orders
post review in /user/review

keep the frontend same. convert the api to postgresql. remeber every item is separated by tenants. make a implimentation file before editing