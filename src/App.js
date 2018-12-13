import React, { Component } from "react";
import { Container } from "reactstrap";
import Header from "./Header";
import Footer from "./Footer";

export default class App extends Component {
  render() {
    return (
      <Container className="App justify-content-center" fluid>
        <Header />
        <Footer />
      </Container>
    );
  }
}
