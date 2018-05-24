import { Node } from 'konva';

// The Konva event from https://github.com/konvajs/konva/issues/209
export namespace Event {
  export interface Mouse {
      type: 'mousedown' | 'mouseup'     | 'mouseover'   |
            'mouseout'  | 'mouseenter'  | 'mouseleave'  |
            'mousemove';
      target: Node;
      currentTarget: Node;
      evt: MouseEvent;
      cancelBubble: boolean;
  }

  export interface MouseWheel {
      type: 'mousewheel';
      target: Node;
      currentTarget: Node;
      evt: MouseWheelEvent;
  }

}