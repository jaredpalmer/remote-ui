import {
  retain,
  createRemoteRoot,
  RemoteRoot,
  RemoteChannel,
} from '@remote-ui/core';
import {Card, Button} from './components/worker';

type RenderCallback = (root: RemoteRoot) => void;

let renderCallback: RenderCallback | undefined;

(globalThis as any).onRender = (callback: RenderCallback) => {
  renderCallback = callback;
};

export function run(script: string, channel: RemoteChannel) {
  retain(channel);

  importScripts(script);

  const root = createRemoteRoot(channel, {components: [Card, Button]});
  renderCallback?.(root);
}
