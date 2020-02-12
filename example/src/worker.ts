import {
  retain,
  createRemoteRoot,
  RemoteRoot,
  RemoteReceiver,
} from '@remote-ui/core';
import { Card, Button } from './components';

type RenderCallback = (root: RemoteRoot) => void;

let renderCallback: RenderCallback | undefined;

// `self` is a reference to the global object here
/** eslint:disable */
(window.self as any).onRender = (callback: RenderCallback) => {
  renderCallback = callback;
};

export function run(script: string, receiver: RemoteReceiver) {
  retain(receiver);

  // @ts-ignore
  const s = document.createElement('script');
  s.src = script;
  document.body.appendChild(s);

  if (renderCallback != null) {
    const remoteRoot = (createRemoteRoot as any)({
      components: [Card, Button],
    });
    renderCallback(remoteRoot);
  }
}
