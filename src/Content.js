import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Checkpoints from "./Content/Checkpoints";
import Info from "./Content/Info";
import { Row } from "reactstrap";
import scrollToComponent from "react-scroll-to-component";

export default class Content extends PureComponent {
  constructor(props) {
    super(props);
    /* --- */
    this.infoRef = React.createRef();
    /* --- */
    this.showInfo = this.showInfo.bind(this);
    /* --- */
    this.state = {
      statistics: null
    };
  }
  render() {
    return (
      <Row className="bg-dark text-white">
        <Checkpoints url={this.props.url} showInfo={this.showInfo} />
        <Info ref={this.infoRef} url={this.props.url} />
      </Row>
    );
  }
  showInfo(identifier) {
    this.infoRef.current.showInfo(identifier);
    scrollToComponent(this.infoRef.current, { align: "top", offset: -10 });
  }
}

Content.propTypes = {
  url: PropTypes.string.isRequired
};
