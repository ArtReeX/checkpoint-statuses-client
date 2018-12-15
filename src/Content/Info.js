import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ip from "ip";
import Count from "react-countup";
import {
  Row,
  Col,
  Jumbotron,
  Badge,
  Input,
  InputGroup,
  InputGroupAddon,
  Progress,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";

class Color {
  static jumbotron(active) {
    if (active) return "bg-info";
    else return "bg-secondary";
  }
  static progressBar(cars) {
    switch (true) {
      case cars <= 25:
        return "success";
      case cars <= 50:
        return "info";
      case cars <= 75:
        return "warning";
      case 75 < cars:
        return "danger";
      default:
        return "success";
    }
  }
}

class Calculation {
  static averageCars(statistics, period) {
    // получение статистики за последние N часов
    const currentDate = new Date().getTime();
    period = period * 60 * 60 * 1000;

    // отсеивание голосований, не попадающих в промежуток времени
    const periodStatistics = statistics.filter(({ date }) => {
      return date > currentDate - period;
    });

    // вычисление суммарного количества машин
    let sum = 0;
    periodStatistics.forEach(({ cars }) => (sum += cars));

    // подсчёт среднего количества машин
    return sum / Number(periodStatistics.length ? periodStatistics.length : 1);
  }
}

export default class Info extends PureComponent {
  constructor(props) {
    super(props);
    /* --- */
    this.modalDialogRef = React.createRef();
    this.periodRef = React.createRef();
    /* --- */
    this.sendStatistics = this.sendStatistics.bind(this);
    this.showInfo = this.showInfo.bind(this);
    /* --- */
    this.state = {
      hiddenStatistics: true,
      info: {
        identifier: 0,
        name: "",
        road: "",
        active: false,
        statistics: [],
        averageCars: 0
      }
    };
  }
  render() {
    const {
      hiddenStatistics,
      info: { identifier, name, road, active, statistics, averageCars }
    } = this.state;
    /* --- */
    return (
      <Col sm="12" md="8">
        <Row className="lead text-center" hidden={!hiddenStatistics}>
          <Col className="m-1">
            <h3>
              Нажмите на любой контрольно-пропускной пункт что бы увидеть его
              статистику...
            </h3>
          </Col>
        </Row>
        <Row className="text-center" hidden={hiddenStatistics}>
          <Col className="m-1">
            <Jumbotron className={Color.jumbotron(active)}>
              <Row>
                <Col>
                  <p className="display-4">{name}</p>
                  <p className="lead">
                    <Badge color={active ? "success" : "dark"}>
                      {active ? "активен" : "не активен"}
                    </Badge>
                  </p>
                  <p className="lead">{road}</p>
                </Col>
              </Row>
              <hr className="my-2" />
              <Row>
                <Col className="lead text-left text-md-center" sm="12" md="8">
                  Приблизительное количество машин по результатам голосования за
                  последние...
                </Col>
                <Col sm="12" md="4">
                  <Input
                    innerRef={this.periodRef}
                    type="select"
                    defaultValue="3"
                    onChange={event => {
                      const period = this.periodRef.current.value;
                      event.preventDefault();
                      this.setState({
                        info: {
                          ...this.state.info,
                          averageCars: Calculation.averageCars(
                            statistics,
                            period
                          )
                        }
                      });
                    }}
                  >
                    <option value="24">24 часа</option>
                    <option value="12">12 часов</option>
                    <option value="6">6 часов</option>
                    <option value="3">3 часа</option>
                    <option value="1">1 час</option>
                  </Input>
                </Col>
              </Row>
              <hr className="my-2" />
              <Row>
                <Col sm="12">
                  <p className="display-4">
                    <Badge color="dark">
                      <Count start={0} end={averageCars} />
                    </Badge>
                  </p>
                </Col>
                <Col sm="12">
                  <Progress
                    animated
                    color={Color.progressBar(averageCars)}
                    value={averageCars}
                  />
                </Col>
              </Row>
              <hr className="my-2" />
              <Row>
                <Col>
                  <Button
                    color="dark"
                    onClick={event => {
                      event.preventDefault();
                      this.modalDialogRef.current.show();
                    }}
                    size="sm"
                  >
                    Добавить информацию
                  </Button>
                </Col>
              </Row>
            </Jumbotron>
          </Col>
        </Row>
        <Dialog
          ref={this.modalDialogRef}
          sendStatistics={cars => this.sendStatistics(identifier, cars)}
        />
      </Col>
    );
  }
  async sendStatistics(identifier, cars) {
    const { url } = this.props;
    const urlAPI = url + "/api/checkpoints/statistics?identifier=" + identifier;
    const data = {
      ip: ip.address(),
      cars
    };
    /* --- */
    await axios.post(urlAPI, data);
    this.showInfo(identifier);
  }
  async showInfo(identifier) {
    const { url } = this.props;
    const period = this.periodRef.current.value;
    const urlAPI = url + "/api/checkpoints?identifier=" + identifier;
    const {
      data: { name, road, active, statistics }
    } = await axios.get(urlAPI);
    /* --- */
    this.setState({
      hiddenStatistics: false,
      info: {
        identifier,
        name,
        road,
        active,
        statistics,
        averageCars: Calculation.averageCars(statistics, period)
      }
    });
    this.modalDialogRef.current.hide();
  }
}

class Dialog extends PureComponent {
  constructor(props) {
    super(props);
    /* --- */
    this.inputCarsRef = React.createRef();
    /* --- */
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    /* --- */
    this.state = {
      modalDialog: false
    };
  }
  render() {
    const { modalDialog } = this.state;
    const { sendStatistics } = this.props;
    /* --- */
    const sendClickHandler = event => {
      const cars = this.inputCarsRef.current.value;
      event.preventDefault();
      sendStatistics(cars);
    };
    const closeClickHandler = event => {
      event.preventDefault();
      this.setState({ modalDialog: false });
    };
    /* --- */
    return (
      <Modal isOpen={modalDialog}>
        <ModalHeader>Добавление статистики</ModalHeader>
        <ModalBody>
          <p className="lead">
            Нажимая кнопку "Отправить", вы даёте согласие на передачу вашего
            IP-адреса на сервер...
          </p>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              Количество машин
            </InputGroupAddon>
            <Input
              innerRef={this.inputCarsRef}
              placeholder="10"
              type="number"
              step="1"
            />
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={sendClickHandler}>
            Отправить
          </Button>
          <Button color="secondary" onClick={closeClickHandler}>
            Закрыть
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  show() {
    this.setState({ modalDialog: true });
  }
  hide() {
    this.setState({ modalDialog: false });
  }
}

Info.propTypes = {
  url: PropTypes.string.isRequired
};
Dialog.propTypes = {
  sendStatistics: PropTypes.func.isRequired
};
