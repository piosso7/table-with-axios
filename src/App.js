import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Modal from "react-modal";
import { v4 as uuid } from "uuid";

function App() {
  const unique_id = uuid();

  const [products, setProducts] = useState([]);

  const [productId, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discontinued, setDiscontinued] = useState("");
  const [units, setUnits] = useState("");

  const [choice, setChoice] = useState();

  useEffect(() => {
    getProduscts();
  }, []);

  function getProduscts() {
    fetch("http://localhost:3000/data").then((result) => {
      result.json().then((resp) => {
        setProducts(resp);
      });
    });
  }

  //DELETE FUNCTION

  function deleteProduct(id) {
    fetch(`http://localhost:3000/data/${id}`, {
      method: "DELETE",
    }).then((result) => {
      result.json().then((resp) => {
        console.warn(resp);
        getProduscts();
        setDeleteIsOpen(false);
        clearValue();
      });
    });
  }

  //CLEAR VALUE FUNCTION

  function clearValue() {
    setName("");
    setPrice("");
    setChoice("default");
    setDiscontinued("default");
    setUnits("");
  }

  //MODALS

  // STYLE
  const productModalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      fontSize: "24px",
    },
  };

  // ____________________________

  // ADD PRODUCT MODAL

  const [addModalIsOpen, setAddIsOpen] = React.useState(false);

  function openAddModal() {
    setAddIsOpen(true);
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/data/", {
        id: unique_id,
        product_name: name,
        price: price,
        discontinued: discontinued,
        units: units,
      })
      .then(function (response) {
        console.log(response);
        getProduscts();
        closeAddModal();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function closeAddModal() {
    setAddIsOpen(false);
    clearValue();
  }

  // ________________________________

  // EDIT PRODUCT MODAL

  const [editModalIsOpen, setEditIsOpen] = React.useState(false);

  function openEditModal(id) {
    axios
      .get(`http://localhost:3000/data/${id}`)
      .then(function (response) {
        setId(response.data.id);
        setName(response.data.product_name);
        setPrice(response.data.price);
        setDiscontinued(response.data.discontinued);
        setUnits(response.data.units);
        setEditIsOpen(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:3000/data/${productId}`, {
        product_name: name,
        price: price,
        discontinued: discontinued,
        units: units,
      })
      .then(function (response) {
        console.log(response);
        getProduscts();
        closeEditModal();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function closeEditModal() {
    setEditIsOpen(false);
    clearValue();
  }

  // DELETE PRODUCT MODAL

  const [deleteModalIsOpen, setDeleteIsOpen] = React.useState(false);

  function openDeleteModal(id) {
    setDeleteIsOpen(true);
    axios
      .get(`http://localhost:3000/data/${id}`)
      .then(function (response) {
        setId(response.data.id);
        setName(response.data.product_name);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function closeDeleteModal() {
    setDeleteIsOpen(false);
    clearValue();
  }

  // _________________________________________

  return (
    <div>
      <tbody className="tbody">
        <button className="addBtn" onClick={openAddModal}>
          Add New
        </button>
        <tr className="descriptions">
          <th className="pName">Product Name</th>
          <th>Price</th>
          <th>Discontinued</th>
          <th>Units In Stock</th>
          <th>Command</th>
        </tr>
        {products.map((product, i) => (
          <tr className="product" key={i}>
            <td>{product.product_name}</td>
            <td>$ {product.price}</td>
            <td>{product.discontinued + ""}</td>
            <td>{product.units}</td>
            <td>
              <button
                className="editBtn"
                onClick={() => openEditModal(product.id)}
              >
                Edit
              </button>
              <button
                className="deleteBtn"
                onClick={() => openDeleteModal(product.id)}
              >
                Remove
              </button>
            </td>

            {/* ADD MODAL */}

            <Modal
              ariaHideApp={false}
              isOpen={addModalIsOpen}
              onRequestClose={closeAddModal}
              style={productModalStyle}
            >
              <h2>Add new product</h2>
              <form>
                <input
                  className="modalInput modalInputName"
                  type="text"
                  placeholder="Product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="modalInput modalInputPrice"
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <select
                  className="modalSelect"
                  value={choice}
                  defaultValue={choice}
                  onChange={(e) => {
                    setChoice(e.target.value);
                    setDiscontinued(e.target.value);
                  }}
                >
                  <option value={"Not selected!"} eveible>
                    Is discontinued?
                  </option>
                  <option value={"true"}>true</option>
                  <option value={"false"}>false</option>
                </select>

                <input
                  className="modalInput modalInputUnits"
                  type="number"
                  placeholder="Units"
                  value={units}
                  onChange={(e) => {
                    setUnits(e.target.value);
                  }}
                />
              </form>
              <button onClick={handleAddSubmit}>Submit</button>
              <button onClick={closeAddModal}>Close</button>
            </Modal>

            {/* EDIT MODAL */}

            <Modal
              ariaHideApp={false}
              isOpen={editModalIsOpen}
              onRequestClose={closeEditModal}
              style={productModalStyle}
            >
              <h2>Edit product</h2>
              <form>
                <input
                  className="modalInput modalInputName"
                  id=""
                  type="text"
                  placeholder="Product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="modalInput modalInputPrice"
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <select
                  className="modalSelect"
                  value={discontinued}
                  defaultValue={product.discontinued}
                  onChange={(e) => {
                    setChoice(e.target.value);
                    setDiscontinued(e.target.value);
                  }}
                >
                  <option value={"Not selected!"} eveible>
                    Is discontinued?
                  </option>
                  <option value={"true"}>true</option>
                  <option value={"false"}>false</option>
                </select>

                <input
                  className="modalInput modalInputUnits"
                  type="number"
                  placeholder="Units"
                  value={units}
                  onChange={(e) => {
                    setUnits(e.target.value);
                  }}
                />
              </form>
              <button onClick={handleEditSubmit}>Submit</button>
              <button onClick={closeEditModal}>Close</button>
            </Modal>

            {/* DELETE MODAL */}

            <Modal
              ariaHideApp={false}
              isOpen={deleteModalIsOpen}
              onRequestClose={closeDeleteModal}
              style={productModalStyle}
            >
              <h2>Are you sure you want to delete {name}</h2>
              <button onClick={() => deleteProduct(productId)}>Yes</button>
              <button onClick={closeDeleteModal}>No</button>
            </Modal>
          </tr>
        ))}
      </tbody>
    </div>
  );
}

export default App;
