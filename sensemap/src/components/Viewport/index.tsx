import * as V from '../../types/viewport';

export interface StateFromProps extends V.State {}
export interface DispatchFromProps {}

interface RenderPropArguments extends V.State {}

interface RenderProp {
  (a: RenderPropArguments): JSX.Element;
}

export interface OwnProps {
  children: RenderProp;
}

export type Props = StateFromProps & DispatchFromProps & OwnProps;

export function Viewport(props: Props) {
  const { children, top, left, width, height, level, baseLevel } = props;
  return children({ top, left, width, height, level, baseLevel });
}

export default Viewport;
