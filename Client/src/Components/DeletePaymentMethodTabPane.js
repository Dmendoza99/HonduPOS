import React, { Component } from "react";
import { Tab, Container, List } from "semantic-ui-react";
import { ClipLoader } from "react-spinners";
import Alert from "./Alert";
class DeletePaymentMethodTabPane extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false, succeed: false, loading: true, payments: [] };
  }
  componentDidMount = () => {
    fetch("/GetAllPayments")
      .then(response => response.json())
      .then(data => {
        this.setState({ payments: data.data, loading: false });
      });
  };
  render() {
    return (
      <Tab.Pane>
        <h1>Productos</h1>
        <hr />
        {this.state.error ? <Alert error mensaje="Error al borrar el modo de pago" /> : null}
        {this.state.succeed ? <Alert mensaje="Modo de pago borrado con exito" /> : null}
        {this.state.loading ? (
          <Container textAlign="center">
            <ClipLoader sizeUnit={"px"} size={150} color={"#123abc"} loading={this.state.loading} />
          </Container>
        ) : (
          <List>
            {this.state.payments.map(pay => {
              return (
                <List.Item>
                  <List.Icon name="payment" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header>{pay.nombre}</List.Header>
                    <List.Description>{pay.otros_detalles}</List.Description>
                  </List.Content>
                  <List.Icon
                    id="deleteIcon"
                    name="trash"
                    size="large"
                    onClick={() => {
                      fetch("/DeletePaymentMethod", {
                        method: "post",
                        body: JSON.stringify({ num_pago: pay.num_pago }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      })
                        .then(response => response.json())
                        .then(data => {
                          console.log(data);
                          if (data.status === "OK") {
                            this.setState({ succeed: true, loading: false, error: false });
                          } else {
                            this.setState({ error: true, loading: false, succeed: false });
                          }
                          fetch("/GetAllPayments")
                            .then(response => response.json())
                            .then(data => {
                              this.setState({ payments: data.data, loading: false });
                            });
                        });
                    }}
                    verticalAlign="middle"
                  />
                </List.Item>
              );
            })}
          </List>
        )}
      </Tab.Pane>
    );
  }
}

export default DeletePaymentMethodTabPane;