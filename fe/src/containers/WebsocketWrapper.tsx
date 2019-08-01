import React from "react";

interface IWebsocketProps {
  url: string
  onMessage: (data: string) => void
  onOpen?: () => void
  onClose?: () => void,
  debug?: boolean,
  reconnect: boolean,
  protocol?: string,
  reconnectIntervalInMilliSeconds?: number
}

interface IWebsocketState {
  ws: WebSocket
  attempts: number
}

class WebsocketWrapper extends React.Component<IWebsocketProps, IWebsocketState> {
  public static defaultProps: any = {
    debug: false,
    reconnect: true,
  };

  private shouldReconnect: boolean;
  private timeoutID: any; // Handle returned by `setTimeout`

  constructor(props: any) {
    super(props);
    this.shouldReconnect = this.props.reconnect;
    this.state = {
      ws: new WebSocket(this.props.url, this.props.protocol),
      attempts: 1,
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.setupWebsocket = this.setupWebsocket.bind(this);
  }

  private logging(logline: string): void {
    if (this.props.debug === true) {
      // tslint:disable-next-line:no-console
      console.log(logline);
    }
  }

  private generateInterval(attempts: number): number {
    if (this.props.reconnectIntervalInMilliSeconds) {
      return this.props.reconnectIntervalInMilliSeconds;
    }
    return Math.min(30, (Math.pow(2, attempts) - 1)) * 1000;
  }

  private setupWebsocket(): void {
    const websocket = this.state.ws;

    websocket.onopen = () => {
      this.logging("Websocket connected");
      // tslint:disable-next-line:brace-style
      if (typeof this.props.onOpen === "function") { this.props.onOpen(); }
    };

    websocket.onmessage = (evt) => {
      this.props.onMessage(evt.data);
    };

    websocket.onclose = () => {
      this.logging("Websocket disconnected");
      if (typeof this.props.onClose === "function") {
        this.props.onClose();
      }
      if (this.shouldReconnect) {
        const time = this.generateInterval(this.state.attempts);
        this.timeoutID = setTimeout(() => {
          this.setState({ attempts: this.state.attempts + 1 });
          this.setState({ ws: new WebSocket(this.props.url, this.props.protocol) });
          this.setupWebsocket();
        }, time);
      }
    };
  }

  public componentDidMount(): void {
    this.setupWebsocket();
  }

  public componentWillUnmount(): void {
    this.shouldReconnect = false;
    clearTimeout(this.timeoutID);
    const websocket = this.state.ws;
    websocket.close();
  }

  public sendMessage(message: string): void {
    const websocket = this.state.ws;
    websocket.send(message);
  }

  public render(): any | null {
    return this.props.children || null;
  }
}

export default WebsocketWrapper;
