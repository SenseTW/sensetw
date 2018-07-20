export interface HasPosition {
  x: number;
  y: number;
}

export interface HasDimension {
  width: number;
  height: number;
}

export type BoundingBox = HasPosition & HasDimension;

export const emptyBoundingBox = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

/**
 * An alternative representation of the `BoundingBox` to eazy the computation.
 *
 * @see {BoundingBox}
 */
export interface BoundingRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const emptyBoundingRect = {
  top: Infinity,
  right: -Infinity,
  bottom: -Infinity,
  left: Infinity,
};

export const rectFromBox = (box: BoundingBox): BoundingRect => (
  box.width * box.height === 0
    ? emptyBoundingRect
    : {
      top: box.y,
      right: box.x + box.width,
      bottom: box.y + box.height,
      left: box.x,
    }
);

export const boxFromRect = (rect: BoundingRect): BoundingBox => (
  rect.top === emptyBoundingRect.top &&
  rect.right === emptyBoundingRect.right &&
  rect.bottom === emptyBoundingRect.bottom &&
  rect.left === emptyBoundingRect.left
    ? emptyBoundingBox
    : {
      x: rect.left,
      y: rect.top,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top,
    }
);

export const flatten = (objects: [BoundingBox]): BoundingBox =>
  boxFromRect(objects.reduce(
    (result, box) => {
      const rect = rectFromBox(box);
      return {
        top: rect.top < result.top ? rect.top : result.top,
        right: rect.right > result.right ? rect.right : result.right,
        bottom: rect.bottom > result.bottom ? rect.bottom : result.bottom,
        left: rect.left < result.left ? rect.left : result.left,
      };
    },
    emptyBoundingRect
  ));
