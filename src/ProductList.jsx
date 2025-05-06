import { Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal and Form States
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [currentProductId, setCurrentProductId] = useState(null);

    // Fetch Products
    useEffect(() => {
        const getProductList = async () => {
            const response = await fetch("https://fakestoreapi.com/products");
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        };
        getProductList();
    }, []);

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                setProducts(products.filter((product) => product.id !== id));
                toast.success("Product Deleted Successfully!");
            } else {
                toast.error("OOPS! Failed to Delete Product.");
            }
        } catch (error) {
            toast.error("Error Deleting Product");
        }
    };

    // Handle Update Product
    const handleUpdateClick = (product) => {
        setCurrentProductId(product.id);
        setTitle(product.title);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setImage(product.image || null);
        setShowModal(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            title,
            description,
            price,
            category,
            image: image ? URL.createObjectURL(image) : null,
        };

        try {
            const response = await fetch(`https://fakestoreapi.com/products/${currentProductId}`, {
                method: "PUT",
                body: JSON.stringify(updatedProduct),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const updatedData = await response.json();
                setProducts(products.map((product) =>
                    product.id === currentProductId ? updatedData : product
                ));
                toast.success("Product Updated Successfully");
            } else {
                toast.error("Failed To Update Product");
            }
        } catch (error) {
            toast.error("Error Updating Product!");
        }

        resetForm();
        setShowModal(false);
    };

    // Handle Add Product
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const newProduct = {
            title,
            description,
            price,
            category,
            image: image ? URL.createObjectURL(image) : null,
        };

        try {
            const response = await fetch("https://fakestoreapi.com/products", {
                method: "POST",
                body: JSON.stringify(newProduct),
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (response.ok) {
                const addedProduct = await response.json();
                setProducts([...products, addedProduct]);
                toast.success("Product Added Successfully");
            } else {
                toast.error("Failed To Add New Product");
            }
        } catch (error) {
            toast.error("Error Adding Product");
        }

        resetForm();
        setShowModal(false);
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory("");
        setImage(null);
        setCurrentProductId(null);
    };

    return (
        <Fragment>
            {/* Toast Notifications Container */}
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            {/* Add Product Button */}
            <div className="row my-3">
                <div className="d-flex justify-content-between align-center">
                    <h1 className="text-info my-2 overflow-hidden">NEW PRODUCTS</h1>
                    <div>
                        <button
                            className="btn btn-info text-white"
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            style={{ float: "right" }}
                        >
                            Add Product
                        </button>
                    </div>

                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <>
                    {/* Backdrop */}
                    <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
                    {/* Modal Content */}
                    <div className="modal fade show" tabIndex="-1" style={{ display: "block" }} aria-labelledby="productModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title text-info" id="productModalLabel">
                                        {currentProductId ? "Update Product" : "Add New Product"}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={currentProductId ? handleUpdateSubmit : handleAddSubmit}>
                                    <div className="modal-body">
                                        <div className="my-1">
                                            <label className="form-label mb-0">Product Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="my-1">
                                            <label className="form-label mb-0">Description</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="my-1">
                                            <label className="form-label mb-0">Product Price</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="my-1">
                                            <label className="form-label mb-0">Product Category</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="my-1">
                                            <label className="form-label mb-0">Upload Image</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) => setImage(e.target.files[0])}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                            Close
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {currentProductId ? "Update Product" : "Add Product"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Product List */}
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="row">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="col-sm-3 mb-4">
                                <div className="card py-2">
                                    <img
                                        src={product.image || "https://via.placeholder.com/200"}
                                        alt={product.title}
                                        className="card-img-top"
                                        style={{ maxHeight: "120px", objectFit: "contain" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.title}</h5>
                                        <p className="card-text">${product.price}</p>
                                        <p className="card-text">{product.description}</p>
                                        <p className="card-text text-info"><span className="text-black">Category : </span>{product.category}</p>
                                    </div>
                                    <div className="text-center">
                                        <button className="btn btn-danger me-2" onClick={() => handleDelete(product.id)}>
                                            Delete
                                        </button>
                                        <button className="btn btn-success" onClick={() => handleUpdateClick(product)}>
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-danger text-center">No Products To List!</p>
                    )}
                </div>
            )}
        </Fragment>
    );
}
