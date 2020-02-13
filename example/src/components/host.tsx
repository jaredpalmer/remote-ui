import React from 'react';
import {RemoteRoot} from '@remote-ui/core';
import {ReactPropsFromRemoteComponentType} from '@remote-ui/react';

export function Card({
  children,
}: ReactPropsFromRemoteComponentType<typeof import('./worker').Card>) {
  return <div className="Card">{children}</div>;
}

export function Button({
  children,
  onPress,
}: ReactPropsFromRemoteComponentType<typeof import('./worker').Button>) {
  return (
    <button type="button" onClick={() => onPress()}>
      {children}
    </button>
  );
}
