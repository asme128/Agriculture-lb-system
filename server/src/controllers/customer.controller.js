const customerService = require("../services/customer.service");

const createCustomer = async (req, res) => {
    try {
        const customerData = {
            ...req.body,
            // registered_by: req.user.user_id, // Assuming user info is in req.user
        };

        const customerId = await customerService.createCustomer(customerData);
        res.status(201).json({
            message: "Customer created successfully",
            customer_id: customerId,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            gender,
            phone,
            email,
            sort_by,
            sort_direction,
        } = req.query;

        const options = {};

        // Only add filters if they exist
        if (first_name || last_name || gender || phone || email) {
            options.filters = {};

            if (first_name)
                options.filters.first_name = { $like: `%${first_name}%` };
            if (last_name)
                options.filters.last_name = { $like: `%${last_name}%` };
            if (gender) options.filters.gender = gender;
            if (phone) options.filters.phone = { $like: `%${phone}%` };
            if (email) options.filters.email = { $like: `%${email}%` };
        }

        // Only add sorting if sort_by exists
        if (sort_by) {
            options.sortBy = sort_by;
            options.sortDirection = sort_direction || "DESC";
        }

        const customers = await customerService.getAllCustomers(options);
        // console.log("🚀 ~ getAllCustomers ~ customers:", customers);
        res.status(200).json(customers);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customer = await customerService.getCustomerById(
            req.params.customer_id
        );
        res.status(200).json(customer);
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        await customerService.updateCustomer(req.params.customer_id, req.body);
        res.status(200).json({
            message: "Customer updated successfully",
            customer_id: req.params.customer_id,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        await customerService.deleteCustomer(req.params.customer_id);
        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
};
