import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Col, Card, CardHeader, CardBody } from "reactstrap";

class Color {
  static card(active) {
    if (active) return "info";
    else return "secondary";
  }
}

export default class Checkpoints extends PureComponent {
  constructor(props) {
    super(props);
    /* --- */
    this.getCheckpointsDOM = this.getCheckpointsDOM.bind(this);
    /* --- */
    this.state = {
      dom: { checkpoints: <div /> }
    };
  }
  componentDidMount() {
    const { getCheckpointsDOM } = this;
    const { url } = this.props;
    const urlAPI = url + "/api/checkpoints";
    /* --- */
    axios.get(urlAPI).then(({ data }) => {
      this.setState({
        dom: {
          checkpoints: getCheckpointsDOM(data)
        }
      });
    });
  }
  render() {
    return (
      <Col className="text-left" sm="12" md="4">
        {this.state.dom.checkpoints}
      </Col>
    );
  }
  getCheckpointsDOM(checkpoints) {
    const { showInfo } = this.props;
    /* --- */
    return checkpoints.map(({ identifier, name, road, active }) => {
      return (
        <Card
          className="m-1"
          key={identifier}
          color={Color.card(active)}
          onClick={event => {
            event.preventDefault();
            showInfo(identifier);
          }}
        >
          <CardHeader className="lead">{name}</CardHeader>
          <CardBody>{road}</CardBody>
        </Card>
      );
    });
  }
}

Checkpoints.propTypes = {
  url: PropTypes.string.isRequired,
  showInfo: PropTypes.func.isRequired
};
