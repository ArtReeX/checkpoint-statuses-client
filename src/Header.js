import React, { PureComponent } from "react";
import { Row, Col } from "reactstrap";

export default class Header extends PureComponent {
  render() {
    return (
      <Row className="bg-dark">
        <Col sm="12" md="{{ size: 6, offset: 3 }}">
          <p className="display-4 text-danger text-center">
            Checkpoint Statuses
          </p>
        </Col>
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <p className="lead text-white text-left text-md-center">
            ... статистика загруженности контрольно-пропускных пунктов!
          </p>
        </Col>
        <Col sm="12" className="bg-info" style={{ height: "1px" }} />
      </Row>
    );
  }
}
