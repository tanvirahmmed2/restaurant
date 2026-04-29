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


role and permission:

Admin:
1. /dashboard/admin/page.jsx: business overview
2. /dashbaord/admin/history/page.jsx: order history
3. /dashbaord/admin/analytics/page.jsx : business analytics, orders statistics and expenses
4. /dashbaord/admin/people/page.jsx : promote users to upper roles by emails only. only show list of management relatd people


Manager:(/dashboard/manager/.....)
1. separate page for categories,  item(rename from product) create , update and delete
2. expenses
3. history
4. reservation
5. reviews
6. support

sales(dashboard/sales/....)
1. /sale to make purchase
2. pending for users made pending orders
3. deliver the accepted orders
4. delivered orders in /orders


make proper routing on the managesidebar and profperly fix the routing and protect them in layout
