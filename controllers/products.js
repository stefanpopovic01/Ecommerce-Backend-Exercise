const Product = require("../models/Product");

async function getProducts (req, res) {
    try {
        const products = await Product.find();
        res.json(products);
    }
    catch {
        res.status(500).json({ message: "Greška pri dohvatanju proizvoda." });
    }    
}

async function getUniqueProduct (req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).send("Proizvod nije pronadjen. ");
        res.json(product);
    }
    catch (err) {
        res.status(400).send("Nevalidan ID.");
    }
}

async function addProduct (req, res) {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } 
    catch (err) {
        res.status(500).json({ message: err.message });
    }    
}

async function editProduct (req, res) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body, 
            {new: true, runValidators: true}
        );
        if(!updatedProduct) return res.status(404).json({ message: "Proizvod nije pronađen." });
        res.json(updatedProduct);
    }
    catch (err) {
        res.status(400).json({ message: "Greška pri ažuriranju proizvoda", error: err.message });        
    }
}

async function updateProduct (req, res) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Proizvod nije pronađen." });
        }
        res.json(updatedProduct);
    }
    catch (err) {
        res.status(400).json({
            message: "Greška pri delimičnom ažuriranju proizvoda",
            error: err.message
        });
    }
}

async function deleteProduct (req, res) {
    try{
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Proizvod sa tim ID-om ne postoji." });
        }
        res.status(200).json({ message: "Proizvod obrisan.", deletedProduct });
    }
    catch (err) {
        res.status(400).json({ message: "Greška pri brisanju proizvoda. ", error: err.message });  
    }
}



module.exports = { getProducts, getUniqueProduct, addProduct, editProduct, updateProduct, deleteProduct };