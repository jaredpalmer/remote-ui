import React from 'react';
import { RemoteRoot } from '@remote-ui/core';

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="Card">{children}</div>;
}

export function Button({
  children,
  onPress,
}: {
  children: React.ReactNode;
  // Functions passed over @remote-ui/rpc always return promises,
  // so make sure it’s a considered return type.
  onPress(): void | Promise<void>;
}) {
  return (
    <button type="button" onClick={() => onPress()}>
      {children}
    </button>
  );
}

export function onRender(renderer: (root: RemoteRoot<any>) => void) {
  (window.self as any).onRender(renderer);
}
