const { default: mongoose } = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

async function createOrder(req, res) {
    try {
        const { userId, products } = req.body;

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: "User not found" });

        let totalPrice = 0;

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if(!product) return res.status(404).json({ message: "Product not found" });

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Nema dovoljno zaliha ovog proizvoda: ${product.name}`
                });
            }
            totalPrice += product.price * item.quantity;
        }

        for (const item of products) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } } 
            );
        }

        const order = new Order({
            userId,
            products, 
            totalPrice
        });

        await order.save();
        res.status(201).json(order);

    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });        
    }

};

async function getOrders(req, res){
    try {
        const orders = await Order.find().populate("userId", "username email").populate("products.productId", "name price");
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ message: "Greska pri dohvatanju porudzbina." });        
    }
}

async function getUniqueOrder(req, res) {
    try {
        const order = await Order.findById(req.params.id).populate("userId", "username email").populate("products.productId", "name price");
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: "Greska pri dohvatanju porudzbine." });        
    }
}

async function editOrder(req, res) {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body, 
            { new: true, runValidators: true }
        ).populate("userId", "username email")
         .populate("products.productId", "name price");

        if(!updatedOrder) 
            return res.status(404).json({ message: "Order sa tim ID-om nije pronađen." });

        res.json(updatedOrder);

    } catch (err) {
        res.status(400).json({ message: "Greška pri ažuriranju ordera", error: err.message });
    }
}

async function updateOrder(req, res) {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order sa tim ID-om nije pronadjen." });

        if(req.body.userId) order.userId = req.body.userId;
        if (req.body.products) order.products = req.body.products;
        if (req.body.totalPrice !== undefined) order.totalPrice = req.body.totalPrice;
        if (req.body.status) order.status = req.body.status;

        await order.save();

    }
    catch (err) {
        res.status(400).json({ message: "Greska pri delimičnom azuriranju ordera", error: err.message });        
    }
}

async function getUserOrders(req, res) {
    try {
        const userId = req.params.id;
        const orders = await Order.find({ userId }) //const orders = await Order.find({ userId: trazeniID }); Mongoose traži sve dokumente u kolekciji gde je polje userId jednako trazeniID. Rezultat je niz svih ordera tog korisnika.

        .populate("products.productId", "name price")
        .populate("userId", "username email");

        res.json(orders);

    }
    catch (err) {
        res.status(500).json({ message: "Greska pri dohvatanju order-a za korisnika", error: err.message });
    }
};

async function deleteOrder(req, res) {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if(!deletedOrder) return res.status(404).json({ message: "Order sa tim ID-om ne postoji." });
        res.status(200).json({ message: "Order obrisan.", deletedOrder });
    }
    catch (err) {
        res.status(400).json({ message: "Greška pri brisanju ordera", error: err.message });         
    }
}


module.exports = { createOrder, getOrders, getUniqueOrder, deleteOrder, editOrder, updateOrder, getUserOrders };