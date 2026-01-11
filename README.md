# 🌸 BLÜMEO – Project Documentation
<img width="1475" height="534" alt="Снимок экрана 2026-01-11 в 17 11 14" src="https://github.com/user-attachments/assets/d3a2cf0b-4ce0-4e52-924c-d429700fab2d" />

## 1. Project Title & Tagline
**Project Name:** BLÜMEO - A digital platform connecting private customers with local flower shops.

## 2. Project Overview / Introduction
**BLÜMEO** is an innovative web-based platform designed to bridge the gap between **local flower shops** and **customers** through an intuitive and interactive website. The platform enables private customers to browse and order pre-made bouquets offered by participating flower shops.
In a **future** development phase, BLÜMEO aims to introduce an **interactive 3D bouquet editor**, allowing customers to visually design their own bouquets before placing an order with a nearby florist.

For local flower shops, BLÜMEO provides a simple gateway into **digitalization**, helping them manage their assortment online, reach new customers, and compete effectively in the modern market without needing their own website.  

By combining **technology, creativity and community**, BLÜMEO supports both customers and florists, making the flower-buying experience more personal, accessible and local.

## 3. Objectives / Goals
- To create a **hyperlocal marketplace** that connects nearby flower shops with customers.  
- To enable **3D bouquet customization** so customers can design their own flower arrangements virtually.  
- To simplify **inventory and order management** for florists.  
- To improve **digital visibility** and customer retention for local flower shops.  

## 4. Benefits of the Project
### For Customers:
- Design personalized bouquets in 3D using the website and order from local florists.  
- Place orders independently of their location with just a few clicks.  
- Explore unique floral combinations visually before purchasing. (?) 
- Enjoy a fast, convenient, and interactive online experience.  

### For Local Florists:
- Gain digital presence **without needing their own website**.  
- Manage inventory, pricing, and product listings online with an easy-to-use interface.  
- Reach new customers and expand their market without technical knowledge or effort.  
- Access insights and analytics to track performance and improve services.  
- Benefit from new advertising and marketing opportunities on the platform.  
- Simplify product and order management, saving time and effort.

## 5. Target Groups
- **Private Customers:** Individuals who want to buy or design personalized bouquets for any occasion.  
- **Local Flower Shops:** Small and medium-sized florists looking to digitize their business.   
- **Administrators:** Manage users, shops, orders, and system integrity.

## 6. Team Members
All team members contributed to both frontend and backend development.
Responsibilities were divided by features, pages, classes, and services.

| Name | Responsibilities in Frontend | Responsibilities in Backend |
|------|------------------|------------------|
| **Anastasiia Kulyani** | Checkout Page, Customer Home Page, Map Page, Cart | BouquetService, CartService, GeocodingService, InventoryService |
| **Akanksha Vijayvergiya** | Shop Profile Page (customer perspective), Shop Owner Home Page, Manage Bouquets Page, Manage Inventory Page | OrderService, CartService |
| **Averest Osman** | Login and Registration Page, Customer Profile Page, Shop Owner Profile Page | UserService, InventoryService |
| **Sama Al Zou'bi** | Customer Orders Page, Shop Owner Orders Page, Chat, Rating | RatingService, InventoryService |

## 7. Functionalities / Features
### 🌸 Private Customers
- **Registration & Login:** Create and access user accounts easily (authentication implemented without advanced security mechanisms).  
- **Home Page:** Displays the most recently added bouquets as well as a carousel featuring participating flower shops. 
- **Map Page:** By clicking the map icon on the Home Page, customers can view all participating flower shops and their locations. Selecting a shop logo redirects the user to the corresponding flower shop profile.  
- **Flower Shop Pages:** View local florist profiles including available bouquets and contact information.
- **Shopping Cart:** Add items to the cart, remove individual items, or clear the entire cart.
- **Checkout:** Proceed with the order process and provide additional details such as delivery information.
- **Order History:** View past orders and track their current status.
- **Chat Function (mock):** Communicate with flower shops or interact with a chatbot for basic support. 
- **User Profile:** Manage personal information, change the password, or delete the account (available in the Vue integration only).
  
### 🌼 Flower Shops
- **Business Registration & Login:** Register and set up shop profile.  
- **Inventory Management:** Digitally manage floral products with prices and stock.
- **Bouquet Management:** Manage your premade bouquets.
- **Order Overview:** Track new, pending, and completed orders with action controls.
- **User Profile:** Manage personal information, change the password, or delete the account (available in the Vue integration only).

![UML Diagram](ClickPrototype/assets/use%20case%20diagram.png)

## 8. System Architecture
![UML Diagram](ClickPrototype/assets/uml-dig.png)

## 9. Tech Stack
**Frontend**

ClickPrototype Folder:
- HTML
- CSS
- JavaScript

Frontend Folder:
- HTML
- CSS
- JavaScript
- Vue.js

Branch lab2/bem:
- HTML and CSS following the BEM methodology
- Sass (SCSS) for modular and maintainable styling
- Partially JavaScript
(Note: Vue.js is not used in this branch.)

**Backend**
- Java
- Spring Boot
- H2 Database (in-memory database for development and testing)

**Development & Tooling**
- Git & Github
- IntelliJ IDEA (backend development)
- Visual Studio Code (frontend development)
- Maven (build and dependency management)

## 10. User Flow / Module Description
_(Explain how users interact with the app step-by-step)_


