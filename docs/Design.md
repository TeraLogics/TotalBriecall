# Overview
This document is designed to show the system design, software design, UI design, and process flow of the Total Briecall project.

# System Design
The design is based around the MVC (Model-View-Controller) design pattern, and utilizes several new technologies in order to fulfill that pattern. The Models are comprised of both database data and API data; the Views are dynamically-rendered using both client-side and server-side templates and delivered to the client; and, the Controllers are where the data is merged, mangled, and transformed.

![Design](/docs/images/MVC%20Design.png?raw=true)

## Models
The model consist of data from two different sources, the API, and MongoDB.  The FoodRecall model wraps the FDA API recall data, adding additional properties from analysis performed by the application and removing data that is not used. The FoodResults model contains paging information and a list of FoodRecall models. The Comments model represents a user-made comment on a recall. Each FoodRecall model contains a list of associated comments.

![Design](/docs/images/Models%20Diagram.png?raw=true)

## Controllers
There are two main controllers in the application: the `recalls` controller and the `comments` controller. The `recalls` controller retrieves `FoodRecall` objects from the `fda` adapter and then retrieves the `Comments` objects associated with those `FoodRecall` objects from the `mongo` adapter. The `comments` controller creates `Comments` using the `mongo` adapter.

## Views
The application consists of two main view sets: the `site` views and the `api` views.

#### Site
The main site views are the `browse` view, and the `details` view. The `browse` view uses the `recalls` controller to get `FoodResults` data for rendering. The `details` view uses the `recalls` controller to retrieve a `FoodResult` to render its details along with its comments.

#### API
The `api` views route the JSON API requests. `FoodResults` can be retrieved via search or individually directly frrom an `api` view. Comments are added to a `FoodResult` via an `api` view.

# Process Flow

![Process Flow](/docs/images/Process%20Flow.png?raw=true)