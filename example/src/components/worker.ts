import {createRemoteReactComponent, RemoteRoot} from '@remote-ui/react';

export const Button = createRemoteReactComponent<
  'Button',
  {
    // Functions passed over @remote-ui/rpc always return promises,
    // so make sure it’s a considered return type.
    onPress(): void | Promise<void>;
  }
>('Button');

export const Card = createRemoteReactComponent('Card');

export function onRender(renderer: (root: RemoteRoot) => void) {
  (globalThis as any).onRender(renderer);
}
