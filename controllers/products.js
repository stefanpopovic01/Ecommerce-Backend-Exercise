const Product = require("../models/Product");

async function getProducts (req, res) {
    try {
        const filters = {};

        if (req.query.category) filters.category = req.query.category; // GET /products?category=clothes

        
        if (req.query.moreThan) filters.price = { $gt: +req.query.moreThan }; // GET /products?moreThan=15
        if (req.query.notCategory) filters.category = { $ne: req.query.notCategory }; // GET /products?notCategory=clothes

        if (req.query.minPrice || req.query.maxPrice){
            if (req.query.minPrice) filters.price = { $gte: +req.query.minPrice }; // GET /products?minPrice=10
            if (req.query.maxPrice) filters.price = { $lte: +req.query.maxPrice}; // GET /products?maxPrice=50
        }                                                                        // GET /products?minPrice=10&maxPrice=30

        if (req.query.categories) filters.category = { $in: req.query.categories.split(",")}; // GET /products?categories=clothes,shoes
        if (req.query.notCategories) filters.category = {$nin: req.query.notCategories.split(",")}; // GET /products?notCategories=clothes,shoes
        if (req.query.nameContains) filters.name = { $regex: req.query.nameContains, $options: "i" }; // GET /products?nameContains=ca

        const sortField = req.query.sortBy || "price";
        const sortOrder = req.query.order === "desc" ? -1 : 1;
        const limit = +req.query.limit || 10;
        const page = +req.query.page || 1;
        const skip = (page - 1) * limit;

        const total = await Product.countDocuments(filters);
        const products = await Product.find(filters)
        .sort({[sortField] : sortOrder})
        .skip(skip)
        .limit(limit);

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            page,
            totalPages,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? page + 1 : null,
            prevPage: hasPrevPage ? page - 1: null,
            products
        });
    }
    catch {
        res.status(500).json({ message: "Greška pri dohvatanju proizvoda." });
    }    
}

/* {
  "page": 2,
  "limit": 10,
  "total": 47,
  "totalPages": 5,
  "hasNextPage": true,
  "hasPrevPage": true,
  "nextPage": 3,
  "prevPage": 1,
  "products": [
    {
      "_id": "67a14f9dd0b9ba17bcfc0a01",
      "name": "Nike Air Max",
      "price": 120,
      "category": "shoes",
      "description": "Running shoes",
      "createdAt": "2025-01-20T14:35:22.123Z",
      "updatedAt": "2025-01-20T14:35:22.123Z"
    },
    {
      "_id": "67a14fdad0b9ba17bcfc0a02",
      "name": "Adidas Hoodie",
      "price": 60,
      "category": "clothing",
      "description": "Casual hoodie",
      "createdAt": "2025-01-19T10:22:11.321Z",
      "updatedAt": "2025-01-19T10:22:11.321Z"
    }
  ]
}
*/

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