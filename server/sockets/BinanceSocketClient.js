import WebSocket from "ws"
import socketLogger from "#utils/socketLogger";

class BinanceSocketClient {
  constructor(path, baseUrl) {
    this.baseUrl = baseUrl || 'wss://stream.binance.us/';
    this._path = path;
    this._createSocket();
    this._handlers = new Map();
  }

  _createSocket() {
    this._ws = new WebSocket(`${this.baseUrl}${this._path}`);

    this._ws.onopen = () => {
      /*TODO:: TEMP OFF*/
      // socketLogger.info('ws connected');
    };

    this._ws.on('pong', () => {
      /*TODO:: TEMP OFF*/
      // socketLogger.debug('received pong from server');
    });
    this._ws.on('ping', () => {
      /*TODO:: TEMP OFF*/
      // socketLogger.debug('==========received ping from server');
      this._ws.pong();
    });

    this._ws.onclose = () => {
      socketLogger.warn('ws closed');
    };

    this._ws.onerror = (err) => {
      socketLogger.warn('ws error', err);
    };

    this._ws.onmessage = (msg) => {
      try {
        const message = JSON.parse(msg.data);
        if (this.isMultiStream(message)) {
          this._handlers.get(message.stream).forEach(cb => cb(message));
        } else if (message.e && this._handlers.has(message.e)) {
          this._handlers.get(message.e).forEach(cb => {
            cb(message);
          });
        } else {
          socketLogger.warn('Unknown method', message);
        }
      } catch (e) {
        socketLogger.warn('Parse message failed', e);
      }
    };
    this.heartBeat();
  }

  isMultiStream(message) {
    return message.stream && this._handlers.has(message.stream);
  }

  heartBeat() {
    setInterval(() => {
      if (this._ws.readyState === WebSocket.OPEN) {
        this._ws.ping();
        /*TODO:: TEMP OFF*/
        // socketLogger.debug("ping server");
      }
    }, 1000 * 60);
  }

  setHandler(method, callback) {
    if (!this._handlers.has(method)) {
      this._handlers.set(method, []);
    }
    this._handlers.get(method).push(callback);
  }
}

export default BinanceSocketClient
