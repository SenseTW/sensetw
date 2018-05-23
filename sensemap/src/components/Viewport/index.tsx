import * as V from '../../types/viewport';

interface RenderPropArguments extends V.State {}

interface RenderProp {
  (a: RenderPropArguments): JSX.Element;
}

export interface StateFromProps extends V.State {}
export interface DispatchFromProps {
  actions: {
    panViewport: typeof V.actions.panViewport,
  };
}

export interface OwnProps {
  children: RenderProp;
}

export type Props = StateFromProps & DispatchFromProps & OwnProps;

export function Viewport(props: Props) {
  return props.children({
    top: props.top,
    left: props.left,
    width: props.width,
    height: props.height,
  });
}

export default Viewport;
