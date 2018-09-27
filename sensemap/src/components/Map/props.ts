import { TransformerForProps } from '../Layout';
import { HasID } from '../../types/sense/has-id';
import { ObjectData, BoxID, CardID } from '../../types';

/**
 * Describes what a map object can do.
 *
 * @extends {TransformerForProps}
 * @template T A `BoxData` or a `CardData`.
 */
export interface MapObjectForProps<T extends HasID<BoxID | CardID>> extends TransformerForProps {
  draggable: boolean;
  object: ObjectData;
  data: T;
  isDirty?: boolean;
  selected?: boolean;
  // tslint:disable:no-any
  onSelect?(e: any, object: ObjectData): void;
  onDeselect?(e: any, object: ObjectData): void;
  onMouseOver?(e: any, object: ObjectData): void;
  onMouseOut?(e: any, object: ObjectData): void;
  onDragStart?(e: any, object: ObjectData): void;
  onDragMove?(e: any, object: ObjectData): void;
  onDragEnd?(e: any, object: ObjectData): void;
  onTouchStart?(e: any, object: ObjectData): void;
  onTouchMove?(e: any, object: ObjectData): void;
  onTouchEnd?(e: any, object: ObjectData): void;
  onMouseOver?(e: any, object: ObjectData): void;
  onMouseOut?(e: any, object: ObjectData): void;
  onOpen?(e: any, data: T extends HasID<infer R> ? R : never): void;
  // tslint:enable
}