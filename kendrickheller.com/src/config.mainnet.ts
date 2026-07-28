import { Configuration } from './contexts/ConfigProvider/ConfigProvider';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

const config: Configuration = {
  backendUrl: isLocal ? 'http://localhost:3000/' : '/api/',
  backendWs: isLocal ? 'ws://localhost:3003' : `${wsProtocol}//${window.location.host}/ws`,
  clientId: '854460595723-dq4l43dqp697074hc9esv06pf5qgo3m3.apps.googleusercontent.com',
  resourceUrl: 'http://rs.kendrickheller.com/',
};

export default config;
