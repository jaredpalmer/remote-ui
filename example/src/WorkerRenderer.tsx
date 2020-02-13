import React from 'react';
import {
  createWorkerFactory,
  createPlainWorkerFactory,
} from '@remote-ui/web-workers';
import {RemoteReceiver, RemoteRenderer, useWorker} from '@remote-ui/react/host';
import {Card, Button} from './components/host';

const createWorker = createWorkerFactory(() =>
  import(/* webpackChunkName: 'worker' */ './worker'),
);
const createThirdPartyWorker = createPlainWorkerFactory(() =>
  import(/* webpackChunkName: 'third-party' */ './third-party'),
);

const COMPONENTS = {Card, Button};

export function WorkerRenderer() {
  const receiver = React.useMemo(() => new RemoteReceiver(), []);
  const worker = useWorker(createWorker);

  React.useEffect(() => {
    // This runs the exported run() function from our worker
    worker.run(createThirdPartyWorker.url!.href, receiver.receive);
  }, [receiver, worker]);

  return <RemoteRenderer receiver={receiver} components={COMPONENTS} />;
}

// The "native" implementations of our remote components:
