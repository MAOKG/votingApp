// flow-typed signature: 7242212c8de0465ce5f2c08c8c8432b8
// flow-typed version: 19506e57e6/react-modal_v1.x.x/flow_>=v0.26.x <=v0.52.x

declare module 'react-modal' {
  declare type DefaultProps = {
    isOpen: bool,
    ariaHideApp: bool,
    closeTimeoutMS: number,
    shouldCloseOnOverlayClick: bool,
  }
  declare type Props = {
    isOpen: bool,
    style?: {
      content?: Object,
      overlay?: Object,
    },
    appElement?: HTMLElement,
    ariaHideApp: bool,
    closeTimeoutMS: number,
    onAfterOpen?: () => mixed,
    onRequestClose?: (event: Event) => mixed,
    shouldCloseOnOverlayClick: bool,
  }
  declare class Modal extends React$Component {
    static setAppElement(element: HTMLElement | string): void;
    static defaultProps: DefaultProps;
    props: Props;
  }
  declare var exports: typeof Modal;
}
