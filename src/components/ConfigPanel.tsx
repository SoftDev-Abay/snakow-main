import React, { Component } from "react";
import { observer } from "mobx-react";
import { configStore } from "../store/configStore";
import styled from "styled-components";

@observer
class ConfigPanel extends Component<{ onRestart: () => void }> {
  handleFoodGrowthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    configStore.setFoodGrowth(Number(event.target.value));
  };

  handleInitialSnakeSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    configStore.setInitialSnakeSize(Number(event.target.value));
  };

  render() {
    return (
      <Panel>
        <h3>Configuration</h3>

        <Label>Food grow by:</Label>
        <Input
          type="number"
          value={configStore.foodGrowth}
          onChange={this.handleFoodGrowthChange}
        />

        <Label>Snake size initially:</Label>
        <Input
          type="number"
          value={configStore.initialSnakeSize}
          onChange={this.handleInitialSnakeSizeChange}
        />

        <RestartButton onClick={this.props.onRestart}>Restart</RestartButton>
      </Panel>
    );
  }
}

export default ConfigPanel;

const Panel = styled.div`
  width: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f9f9f9;
`;

const Label = styled.label`
  display: block;
  margin-top: 10px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const RestartButton = styled.button`
  display: block;
  padding: 8px;
  margin-top: 15px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 3px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #ff4c4c;
  }
`;
