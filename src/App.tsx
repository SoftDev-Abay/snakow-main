import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Snakow } from "./core/Snakow";
import ConfigPanel from "./components/ConfigPanel";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 24px;
  text-align: center;
`;

const ScoresRow = styled.div`
  display: flex;
  justify-content: center;
`;

const Scores = styled.div`
  font-weight: 600;
`;

const Info = styled.div`
  margin-left: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

@observer
class App extends React.Component {
  snakow?: Snakow;

  onRef = (canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      this.snakow = new Snakow(canvas);
      this.snakow.start();
      this.setState({}); 
    }
  };

  handleRestart = () => {
    if (this.snakow) {
      this.snakow.restart();
    }
  };

  render() {
    return (
      <Row>
        <Wrapper>
          <Heading>SNAKOW</Heading>
          <ScoresRow>
            <Scores>
              <span style={{ color: "red" }}>
                {this.snakow?.snakes[0].points &&
                  this.snakow.snakes[0].points * 5}
              </span>
              {" : "}
              <span style={{ color: "black" }}>
                {this.snakow?.snakes[1].points &&
                  this.snakow.snakes[1].points * 5}
              </span>
            </Scores>
          </ScoresRow>
          <canvas
            ref={this.onRef}
            style={{
              width: 500,
              height: 500,
              border: "1px solid grey",
            }}
          />
        </Wrapper>
        <Info>
          <div>
            <b>Steuerung</b>
            <br />
            Rote Schlange über WASD
            <br />
            Schwarze Schlange über die Pfeiltasten
          </div>
          <ConfigPanel onRestart={this.handleRestart} />{" "}
        </Info>
      </Row>
    );
  }
}

export default App;
