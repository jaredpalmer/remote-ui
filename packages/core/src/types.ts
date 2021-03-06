import {
  RemoteComponentType,
  IdentifierForRemoteComponent,
  PropsForRemoteComponent,
} from '@remote-ui/types';

type NonOptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

type IfAllOptionalKeys<Obj, If, Else = never> = NonOptionalKeys<Obj> extends {
  length: 0;
}
  ? If
  : Else;

export const ACTION_MOUNT = 0;
export const ACTION_INSERT_CHILD = 1;
export const ACTION_REMOVE_CHILD = 2;
export const ACTION_UPDATE_TEXT = 3;
export const ACTION_UPDATE_PROPS = 4;

export const UPDATE_INSERT = 0;
export const UPDATE_REMOVE = 1;

export type Id = string;

export interface MessageMap {
  [ACTION_UPDATE_TEXT]: [Id, string];
  [ACTION_UPDATE_PROPS]: [Id, object];
  [ACTION_INSERT_CHILD]: [
    Id | undefined,
    number,
    RemoteTextSerialization | RemoteComponentSerialization,
  ];
  [ACTION_REMOVE_CHILD]: [Id | undefined, number];
  [ACTION_MOUNT]: [(RemoteTextSerialization | RemoteComponentSerialization)[]];
}

export interface RemoteChannel {
  <T extends keyof MessageMap>(
    type: T,
    ...payload: MessageMap[T]
  ): void | Promise<void>;
}

export enum RemoteKind {
  Text,
  Component,
}

type AllowedRemoteChildren<
  Children,
  Root extends RemoteRoot<any, any>
> = Children extends RemoteComponentType<string, any, any>
  ? RemoteComponent<Children, Root>
  : never;

type ExtractChildren<Type> = Type extends RemoteComponentType<
  string,
  any,
  infer Children
>
  ? Children
  : never;

type AllowedChildren<
  Children extends RemoteComponentType<string, any> | boolean,
  Root extends RemoteRoot<any, any>,
  AllowString extends boolean = false
> = Children extends true
  ? RemoteComponent<any, Root> | AllowedTextChildren<Root, AllowString>
  : Children extends false
  ? never
  :
      | AllowedRemoteChildren<Children, Root>
      | AllowedTextChildren<Root, AllowString>;

type AllowedTextChildren<
  Root extends RemoteRoot<any, any>,
  AllowString extends boolean = false
> = AllowString extends true ? RemoteText<Root> | string : RemoteText<Root>;

export interface RemoteRoot<
  AllowedComponents extends RemoteComponentType<
    string,
    any
  > = RemoteComponentType<any, any>,
  AllowedChildrenTypes extends RemoteComponentType<string, any> | boolean = true
> {
  readonly children: readonly AllowedChildren<
    AllowedChildrenTypes,
    RemoteRoot<AllowedComponents, AllowedChildrenTypes>
  >[];
  appendChild(
    child: AllowedChildren<
      AllowedChildrenTypes,
      RemoteRoot<AllowedComponents, AllowedChildrenTypes>,
      true
    >,
  ): void | Promise<void>;
  removeChild(
    child: AllowedChildren<
      AllowedChildrenTypes,
      RemoteRoot<AllowedComponents, AllowedChildrenTypes>
    >,
  ): void | Promise<void>;
  insertChildBefore(
    child: AllowedChildren<
      AllowedChildrenTypes,
      RemoteRoot<AllowedComponents, AllowedChildrenTypes>
    >,
    before: AllowedChildren<
      AllowedChildrenTypes,
      RemoteRoot<AllowedComponents, AllowedChildrenTypes>
    >,
  ): void | Promise<void>;
  createComponent<Type extends AllowedComponents>(
    type: Type,
    ...propsPart: IfAllOptionalKeys<
      PropsForRemoteComponent<Type>,
      [PropsForRemoteComponent<Type>?],
      [PropsForRemoteComponent<Type>]
    >
  ): RemoteComponent<Type, RemoteRoot<AllowedComponents, AllowedChildrenTypes>>;
  createText(
    text?: string,
  ): RemoteText<RemoteRoot<AllowedComponents, AllowedChildrenTypes>>;
  mount(): Promise<void>;
}

export const KIND_COMPONENT = 1;
export const KIND_TEXT = 2;

export interface RemoteComponent<
  Type extends RemoteComponentType<string, any>,
  Root extends RemoteRoot<any, any>
> {
  readonly kind: typeof KIND_COMPONENT;
  readonly id: string;
  readonly type: IdentifierForRemoteComponent<Type>;
  readonly props: PropsForRemoteComponent<Type>;
  readonly children: readonly AllowedChildren<ExtractChildren<Type>, Root>[];
  readonly root: Root;
  readonly top: RemoteComponent<any, Root> | Root | null;
  readonly parent: RemoteComponent<any, Root> | Root | null;
  updateProps(
    props: Partial<PropsForRemoteComponent<Type>>,
  ): void | Promise<void>;
  appendChild(
    child: AllowedChildren<ExtractChildren<Type>, Root, true>,
  ): void | Promise<void>;
  removeChild(
    child: AllowedChildren<ExtractChildren<Type>, Root>,
  ): void | Promise<void>;
  insertChildBefore(
    child: AllowedChildren<ExtractChildren<Type>, Root>,
    before: AllowedChildren<ExtractChildren<Type>, Root>,
  ): void | Promise<void>;
}

export interface RemoteText<Root extends RemoteRoot<any, any>> {
  readonly kind: typeof KIND_TEXT;
  readonly id: string;
  readonly text: string;
  readonly root: Root;
  readonly top: RemoteComponent<any, Root> | Root | null;
  readonly parent: RemoteComponent<any, Root> | Root | null;
  updateText(text: string): void | Promise<void>;
}

export type RemoteChild<Root extends RemoteRoot<any, any>> =
  | RemoteComponent<any, Root>
  | RemoteText<Root>;

export type RemoteComponentSerialization<
  Type extends RemoteComponentType<string, any> = RemoteComponentType<
    string,
    any
  >
> = {
  -readonly [K in 'id' | 'type' | 'props']: RemoteComponent<Type, any>[K];
} & {
  children: (RemoteComponentSerialization | RemoteTextSerialization)[];
};

export type RemoteTextSerialization = {
  -readonly [K in 'id' | 'text']: RemoteText<any>[K];
};

export type Serialized<T> = T extends RemoteComponent<infer Type, any>
  ? RemoteComponentSerialization<Type>
  : T extends RemoteText<any>
  ? RemoteTextSerialization
  : never;

export enum RemoteComponentViolationType {
  InsertChild,
  InsertRoot,
  UpdateProps,
}
