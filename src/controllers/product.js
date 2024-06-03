const pool = require('../database');

// Obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products');
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ error: 'No se encontraron productos' });
        }
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
    const idProducto = req.params.id;
    if (!isNaN(idProducto)) {
        try {
            const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [idProducto]);
            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontró producto' });
            }
        } catch (error) {
            console.error('Error al obtener producto por ID:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese ID' });
    }
};

// Obtener producto por nombre
const getProductByName = async (req, res) => {
    const nombre = req.params.name;
    if (typeof nombre === 'string') {
        try {
            const { rows } = await pool.query('SELECT * FROM products WHERE name = $1', [nombre]);
            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontró producto' });
            }
        } catch (error) {
            console.error('Error al obtener producto por nombre:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese nombre' });
    }
};

// Obtener productos por categoría
const getProductsByCategory = async (req, res) => {
    const categoria = req.params.category_id;
    if (!isNaN(categoria)) {
        try {
            const { rows } = await pool.query('SELECT * FROM products WHERE category_id = $1', [categoria]);
            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ error: 'No se encontraron productos bajo esa categoría' });
            }
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Categoría no válida' });
    }
};

// Añadir producto al carrito
const addProductCart = async (req, res) => {
    const { id, name, price, stock, quantity, image_path } = req.body;
    try {
        await pool.query('INSERT INTO cart (id, name, price, stock, quantity, image_path) VALUES ($1, $2, $3, $4, $5, $6)', [id, name, price, stock, quantity, image_path]);
        res.status(200).json({ message: 'Producto añadido al carrito exitosamente' });
    } catch (error) {
        console.error('Error al añadir producto al carrito:', error.message);
        res.status(400).json({ error: 'Error al añadir producto al carrito' });
    }
};

const getProductStock = async (req, res) => {
    const idProducto = req.params.id;
    if (!isNaN(idProducto)) {
        try {
            const { rows } = await pool.query('SELECT stock FROM products WHERE id = $1', [idProducto]);
            if (rows.length > 0) {
                res.status(200).json({ stock: rows[0].stock });
            } else {
                res.status(404).json({ error: 'No se encontró producto' });
            }
        } catch (error) {
            console.error('Error al obtener stock del producto:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese ID' });
    }
};

// Actualizar stock de un producto
const updateProductStock = async (req, res) => {
    const { id, stock } = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (rows.length > 0) {
            await pool.query('UPDATE products SET stock = $1 WHERE id = $2', [stock, id]);
            res.status(200).json({ message: 'Stock del producto actualizado' });
        } else {
            res.status(404).json({ error: 'No se encontró el producto' });
        }
    } catch (error) {
        console.error('Error al actualizar el stock del producto:', error.message);
        res.status(400).json({ error: 'Error al actualizar el stock del producto' });
    }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
    const { name, price, stock, category_id, image_path } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO products (name, price, stock, category_id, image_path) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, price, stock, category_id, image_path]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Modificar un producto
const updateProduct = async (req, res) => {
    const idProducto = req.params.id;
    const { name, price, stock, category_id, image_path } = req.body;
    if (!isNaN(idProducto)) {
        try {
            const { rows } = await pool.query(
                'UPDATE products SET name = $1, price = $2, stock = $3, category_id = $4, image_path = $5 WHERE id = $6 RETURNING *',
                [name, price, stock, category_id, image_path, idProducto]
            );
            if (rows.length > 0) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).json({ error: 'No se encontró producto' });
            }
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese ID' });
    }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
    const idProducto = req.params.id;
    if (!isNaN(idProducto)) {
        try {
            const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [idProducto]);
            if (rowCount > 0) {
                res.status(200).json({ message: 'Producto eliminado correctamente' });
            } else {
                res.status(404).json({ error: 'No se encontró producto' });
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ error: 'Producto no encontrado bajo ese ID' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductByName,
    getProductsByCategory,
    addProductCart,
    getProductStock,
    updateProductStock,
    createProduct,
    updateProduct,
    deleteProduct
};
