import React, { Component } from "react";
import { Container } from "reactstrap";
import config from "./config";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";

export default class App extends Component {
  render() {
    return (
      <Container className="App" fluid>
        <Header />
        <Content url={config.server.url + ":" + config.server.port} />
        <Footer />
      </Container>
    );
  }
}
