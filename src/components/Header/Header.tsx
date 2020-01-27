import * as React from "react";
import { Switch } from "../Switch/Switch";

import "./header.css";

interface HeaderProps {
  showResults: boolean;
  socket: SocketIOClient.Socket;
  boardId: string;
}

export class Header extends React.Component<HeaderProps> {

  toggleShowResults(e: React.MouseEvent) {
    e.preventDefault();
    // emit an event to show results.
    this.props.socket.emit(`board:show-results`, {
      boardId: this.props.boardId,
      sessionId: sessionStorage.getItem("retroSessionId"),
    });
  }

  render() {
    return (
      <header>
        <div id="top-header">
          <div id="logo">
            <div className="text">Retro</div>
          </div>
          { this.props.showResults ? <h1>Reviewing</h1> : null }
          <div id="app-controls">
            <Switch id="toggle-app-state" />
            <button onClick={(e) => this.toggleShowResults(e)}>
              { this.props.showResults ? "Resume Retro" : "Review Results"}
            </button>
          </div>
        </div>
      </header>
    );
  }
}
