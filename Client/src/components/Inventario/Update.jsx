import React, { Component } from "react";
import { Row, Col, Form, Grid } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";

class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _notificationSystem: null,
      categoria: {},
      pago: {},
      producto: {},
      cliente: {},
    };
    this.props = { AllProducts: [], AllCategories: [], AllPayments: [], AllClients: [] };
  }

  componentDidMount = async () => {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
  };
  sendNotification = (position, color, message, icon) => {
    var level = color; // 'success', 'warning', 'error' or 'info'
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className={icon} />,
      message: <div>{message}</div>,
      level: level,
      position: position,
      autoDismiss: 15,
    });
  };
  componentWillReceiveProps = new_props => {
    if (new_props.AllCategories.length > 0) {
      this.setState({
        categoriaId: new_props.AllCategories[0].id_categoria,
        categoria: new_props.AllCategories[0],
      });
    }
    if (new_props.AllPayments.length > 0) {
      this.setState({ pagoId: new_props.AllPayments[0].num_pago });
    }
    if (new_props.AllProducts.length > 0) {
      this.setState({
        productoId: new_props.AllProducts[0].id_producto,
        producto: new_props.AllProducts[0],
      });
    }
    if (new_props.AllClients.length > 0) {
      this.setState({ clienteId: new_props.AllClients[0].id_cliente });
    }
  };

  handleSubmit = (e, id) => {
    switch (id) {
      case 0: {
        fetch("http://localhost:3001/updateProduct", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.state.producto),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if (data.status === "OK") {
              this.sendNotification(
                "tr",
                "success",
                "Producto actualizado con exito",
                "fa fa-check"
              );
              this.props.update();
            } else {
              this.sendNotification(
                "tr",
                "error",
                "Error al actualizar el producto",
                "fa fa-times"
              );
            }
          });
        break;
      }
      case 1: {
        fetch("http://localhost:3001/updateCategorie", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.state.categoria),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if (data.status === "OK") {
              this.sendNotification(
                "tr",
                "success",
                "Categoria actualizada con exito",
                "fa fa-check"
              );
              this.props.update();
            } else {
              this.sendNotification(
                "tr",
                "error",
                "Error al actualizar la categoria",
                "fa fa-times"
              );
            }
          });
        break;
      }
      default:
        break;
    }
  };
  handleChange = e => {
    switch (e.target.name) {
      case "selectedProduct": {
        this.setState({ [e.target.name]: e.target.value });
        break;
      }
      case "categoriaProducto": {
        this.setState({
          producto: { ...this.state.producto, id_categoria: parseFloat(e.target.value) },
        });
        break;
      }
      case "nombreProducto": {
        this.setState({
          producto: { ...this.state.producto, nombre: e.target.value },
        });
        break;
      }
      case "precioProducto": {
        this.setState({
          producto: { ...this.state.producto, precio: e.target.value },
        });
        break;
      }
      case "fotoProducto": {
        let files = e.target.files;
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = e => {
          this.setState({
            producto: { ...this.state.producto, image: e.target.result },
          });
        };
        break;
      }
      case "nombreCategoria": {
        this.setState({
          categoria: { ...this.state.categoria, nombre: e.target.value },
        });
        break;
      }
      case "descripcionCategoria": {
        this.setState({
          categoria: { ...this.state.categoria, descripcion: e.target.value },
        });
        break;
      }
      default: {
        this.setState({ [e.target.name]: e.target.value });
        break;
      }
    }
  };

  render() {
    return (
      <Row>
        <NotificationSystem ref="notificationSystem" style={style} />
        <Col md={12}>
          <Card
            title="Actualizar Producto"
            content={
              <Form
                onSubmit={e => {
                  e.preventDefault();
                  this.handleSubmit(e, 0);
                }}>
                <FormInputs
                  ncols={["col-md-12"]}
                  properties={[
                    {
                      componentClass: "select",
                      label: "Producto",
                      children: this.props.AllProducts.map((prod, keys) => (
                        <option key={keys} value={keys}>
                          {prod.nombre}
                        </option>
                      )),
                      bsClass: "form-control",
                      name: "selectedProduct",
                      onChange: e => {
                        this.setState({
                          [e.target.name]: e.target.value,
                          producto: this.props.AllProducts[e.target.value],
                        });
                      },
                      placeholder: "Producto",
                    },
                  ]}
                />
                <FormInputs
                  ncols={["col-md-3", "col-md-3", "col-md-3", "col-md-3"]}
                  properties={[
                    {
                      componentClass: "select",
                      label: "Categoria",
                      children: this.props.AllCategories.map((prod, keys) => (
                        <option key={keys} value={prod.id_categoria}>
                          {prod.nombre}
                        </option>
                      )),
                      bsClass: "form-control",
                      name: "categoriaProducto",
                      onChange: this.handleChange,
                      placeholder: "Categoria",
                      value: this.state.producto.id_categoria,
                      required: true,
                    },
                    {
                      label: "Nombre",
                      name: "nombreProducto",
                      type: "text",
                      bsClass: "form-control",
                      onChange: this.handleChange,
                      placeholder: "Nombre de producto",
                      value: this.state.producto.nombre,
                      required: true,
                    },
                    {
                      label: "Precio",
                      name: "precioProducto",
                      type: "number",
                      min: 0,
                      bsClass: "form-control",
                      onChange: this.handleChange,
                      placeholder: "Precio de producto",
                      value: this.state.producto.precio,
                      required: true,
                    },
                    {
                      label: "Foto",
                      name: "fotoProducto",
                      type: "file",
                      multiple: false,
                      accept: "image/*",
                      bsClass: "form-control",
                      onChange: this.handleChange,
                      placeholder: "Precio de producto",
                    },
                  ]}
                />
                <Button bsStyle="success" pullRight fill type="submit">
                  Actualizar
                </Button>
                <div className="clearfix" />
              </Form>
            }
          />

          <Card
            title="Actualizar Categoria"
            content={
              <Form
                onSubmit={e => {
                  e.preventDefault();
                  this.handleSubmit(e, 1);
                }}>
                <FormInputs
                  ncols={["col-md-12"]}
                  properties={[
                    {
                      componentClass: "select",
                      label: "Producto",
                      children: this.props.AllCategories.map((prod, keys) => (
                        <option key={keys} value={keys}>
                          {prod.nombre}
                        </option>
                      )),
                      bsClass: "form-control",
                      name: "selectedProduct",
                      onChange: e => {
                        this.setState({
                          [e.target.name]: e.target.value,
                          categoria: this.props.AllCategories[e.target.value],
                        });
                      },
                      placeholder: "Producto",
                    },
                  ]}
                />
                <FormInputs
                  ncols={["col-md-6", "col-md-6"]}
                  properties={[
                    {
                      label: "Nombre",
                      type: "text",
                      name: "nombreCategoria",
                      bsClass: "form-control",
                      onChange: this.handleChange,
                      placeholder: "Nombre de la categoria",
                      value: this.state.categoria.nombre,
                      required: true,
                    },
                    {
                      label: "Descripcion",
                      type: "text",
                      name: "descripcionCategoria",
                      bsClass: "form-control",
                      onChange: this.handleChange,
                      placeholder: "Descripcion de la categoria",
                      value: this.state.categoria.descripcion,
                      required: true,
                    },
                  ]}
                />
                <Button bsStyle="success" pullRight fill type="submit">
                  Actualizar
                </Button>
                <div className="clearfix" />
              </Form>
            }
          />
        </Col>
      </Row>
    );
  }
}

export default Update;
