import React, { PureComponent } from "react";
import { Row, Col, Button } from "reactstrap";

export default class Header extends PureComponent {
  render() {
    return (
      <Row className="bg-dark text-center">
        <Col sm="12" className="bg-danger" style={{ height: "2px" }} />
        <Col sm="12" md={{ size: 2, offset: 5 }}>
          <Button
            className="lead text-white m-1"
            pref="https://t.me/Arthur_Lazarenko"
            target="_blank"
            size="sm"
            color="secondary"
            outline
            block
          >
            @Arthur_Lazarenko
          </Button>
        </Col>
      </Row>
    );
  }
}
