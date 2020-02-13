import React from 'react';
import ReactDOM from 'react-dom';
import {WorkerRenderer} from './WorkerRenderer';

const App: React.FC<any> = ({children}) => <div>fuck{children}</div>;

ReactDOM.render(
  <App>
    <WorkerRenderer />
  </App>,
  document.getElementById('root'),
);
