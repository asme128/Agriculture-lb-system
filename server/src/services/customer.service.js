const Customer = require("../models/customer.model");
const CustomError = require("../utils/CustomError");

class CustomerService {
    async createCustomer(customerData) {
        try {
            return await Customer.create(customerData);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async getAllCustomers(options = {}) {
        try {
            return await Customer.findAll(options);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async getCustomerById(customer_id) {
        try {
            const customer = await Customer.findById(customer_id);
            if (!customer) {
                throw new CustomError(404, "Customer not found");
            }
            return customer;
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async updateCustomer(customer_id, customerData) {
        try {
            return await Customer.update(customer_id, customerData);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }

    async deleteCustomer(customer_id) {
        try {
            await Customer.delete(customer_id);
        } catch (err) {
            throw new CustomError(err.statusCode || 500, err.message);
        }
    }
}

module.exports = new CustomerService();
