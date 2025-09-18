// Import required modules
const express = require("express");
const authRoutes = require("./auth.route.js");
const customerRoutes = require("./customer.route.js");
const staffRoutes = require("./staff.route.js");
const uploadRoutes = require("./upload.route.js");
const projectRoutes = require("./project.route.js");
const orderRoutes = require("./order.route.js");
const opInvRoutes = require("./operation.inventory.route.js");
const inventoryRoutes = require("./inventory.route.js");
const paymentRoutes = require("./payment.route.js");
const systemRoutes = require("./system.routes.js");
const expenseRoutes = require("./expense.route.js");
const operationRoutes = require("./operation.route.js");
const remainderRoutes = require("./remainder.route.js");
const visitRoutes = require("./visit.routes.js");
const bidRoutes = require("./bid.routes.js");   
const personRoutes = require("./person.route.js"); // Import the person routes
const config = require("../config/config");

// Create an instance of the Express router
const router = express.Router();

/**
 * Default routes that are available in all environments.
 * Each route includes a `path` (the base URL) and the corresponding `route` file.
 */
const defaultRoutes = [
    {
        path: "/auth",
        route: authRoutes,
    },
    {
        path: "/inventory", // Base URL for inventory-related routes
        route: inventoryRoutes,
    },
   {
        path: "/person", // Base URL for payment-related routes
        route: personRoutes,
    },
    {
        path: "/payment", // Base URL for payment-related routes
        route: paymentRoutes,
    },

    {
        path: "/project", // Base URL for project-related routes
        route: projectRoutes,
    },
    {
        path: "/order", // Base URL for order-related routes
        route: orderRoutes,
    },

    {
        path: "/upload", // Base URL for project-related routes
        route: uploadRoutes,
    },
    {
        path: "/customer", // Base URL for project-related routes
        route: customerRoutes,
    },
    {
        path: "/staff", // Base URL for project-related routes
        route: staffRoutes,
    },
    {
        path: "/opInv", // Base URL for project-related routes
        route: opInvRoutes,
    },
    {
        path: "/system", // Base URL for project-related routes
        route: systemRoutes,
    },
    {
        path: "/expense", // Base URL for project-related routes
        route: expenseRoutes,
    },
    {
        path: "/operation", // Base URL for project-related routes
        route: operationRoutes,
    },
    {
        path: "/remainder", // Base URL for project-related routes
        route: remainderRoutes,
    },
    {
        path: "/visit", // Base URL for project-related routes
        route: visitRoutes,
    },
    {
        path: "/bid", // Base URL for project-related routes
        route: bidRoutes,
    },
];

/**
 * Development-only routes.
 * These routes are only mounted when the application is running in development mode.
 * For example, this can include documentation or testing utilities.
 */
const devRoutes = [
    // Uncomment and define additional development routes as needed
    // {
    //   path: '/docs',
    //   route: docsRoute,
    // },
];

// Register all default routes to the router
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

/* istanbul ignore next */
// Uncomment this block if you want to conditionally load development-only routes
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

// Export the configured router for use in the main application
module.exports = router;
