import React, { useState, useEffect } from "react";
import "./landingpage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const handleShowModal = () => setShowModal(true);

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const handleDeleteProduct = (productId) => {
    axios
      .delete(`http://localhost:8081/product/${productId}`)
      .then((res) => {
        console.log(res.data);
        fetchProducts(); // Refresh the list after deletion
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
      });
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const values = {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
    };

    if (newProduct.name && newProduct.description && !isNaN(newProduct.price)) {
      axios
        .post("http://localhost:8081/add", values)
        .then((res) => {
          console.log(res);
          handleCloseModal();
          fetchProducts();
        })
        .catch((err) => console.log(err));
    } else {
      alert("Enter all the values correctly");
    }
  };

  const handleEditProduct = async (event) => {
    event.preventDefault();
    const values = {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
    };

    if (newProduct.name && newProduct.description && !isNaN(newProduct.price)) {
      axios
        .put(`http://localhost:8081/product/${currentProduct.id}`, values)
        .then((res) => {
          console.log(res);
          handleCloseModal();
          fetchProducts();
        })
        .catch((err) => console.log(err));
    } else {
      alert("Enter all the values correctly");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "image") {
      setNewProduct({ ...newProduct, image: event.target.files[0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const fetchProducts = () => {
    axios
      .get("http://localhost:8081/product")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditButtonClick = (product) => {
    setCurrentProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    });
    setIsEditing(true);
    handleShowModal();
  };

  return (
    <div className="MainBox">
      <h1>Product List</h1>

      <div className="app-container">
        <table>
          <thead>
            <tr>
              <th>Img</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.image && (
                    <img
                      src={`data:image/jpeg;base64,${btoa(
                        new Uint8Array(product.image.data).reduce(
                          (data, byte) => data + String.fromCharCode(byte),
                          ""
                        )
                      )}`}
                      alt={product.name}
                    />
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>
                  <button onClick={() => handleEditButtonClick(product)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ButtonContaner">
        <button
          className="add-product-button"
          onClick={() => {
            setNewProduct({
              name: "",
              description: "",
              price: "",
              image: null,
            });
            setIsEditing(false);
            handleShowModal();
          }}
        >
          Add Product
        </button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Product" : "Add New Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                onChange={handleInputChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={isEditing ? handleEditProduct : handleAddProduct}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LandingPage;
