const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        required: true,
        enum: ["electronics", "clothes", "books", "shoes", "other"],
        default: "other"    
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    }
}, { timestamps: true } );

module.exports = mongoose.model("Product", productSchema);