const express = require("express");
const router = express.Router();
const bidController = require("../controllers/bid.controller");
const {
    createBidSchema,
    updateBidSchema,
    getBidSchema,
    deleteBidSchema,
} = require("../validations/bid.validation");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

// Create a new bid
router.post("/", auth("3"), validate(createBidSchema), bidController.createBid);

// Get all bids with optional filtering
router.get("/", auth("1", "2", "3", "4"), bidController.getAllBids);

// Get a bid by ID
router.get(
    "/:bid_id",
    auth("1", "2", "3", "4"),
    validate(getBidSchema),
    bidController.getBidById
);

// Update a bid
router.put("/", auth("3"), validate(updateBidSchema), bidController.updateBid);

// Delete a bid
router.delete(
    "/",
    auth("3"),
    validate(deleteBidSchema),
    bidController.deleteBid
);

module.exports = router;
