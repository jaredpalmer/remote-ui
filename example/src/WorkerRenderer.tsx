import React from 'react';
import { Card, Button } from './components';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { RemoteReceiver, RemoteRenderer } from '@remote-ui/react/host';

const createWorker = createWorkerFactory(() => import('./worker'));

const COMPONENTS = { Card, Button };
const THIRD_PARTY_SCRIPT = 'http://localhost:5000/worker.umd.development.js';

export function WorkerRenderer() {
  const receiver = React.useMemo(() => new RemoteReceiver(), []);
  const worker = useWorker(createWorker);

  React.useEffect(() => {
    // This runs the exported run() function from our worker
    worker.run(THIRD_PARTY_SCRIPT, (receiver as any).receive as any);
  }, [receiver, worker]);

  return <RemoteRenderer receiver={receiver} components={COMPONENTS} />;
}

// The "native" implementations of our remote components:
