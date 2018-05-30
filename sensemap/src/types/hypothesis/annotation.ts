export interface BaseSelector {
  type: string;
  refinedBy?: Selector;
}

export interface FragmentSelector extends BaseSelector {
  type: 'FragmentSelector';
  value: string;
  conformsTo?: string;
}

export interface CSSSelector extends BaseSelector {
  type: 'CSSSelector';
  value: string;
}

export interface XPathSelector extends BaseSelector {
  type: 'XPathSelector';
  value: string;
}

export interface TextQuoteSelector extends BaseSelector {
  type: 'TextQuoteSelector';
  exact: string;
  prefix?: string;
  suffix?: string;
}

export interface TextPositionSelector extends BaseSelector {
  type: 'TextPositionSelector';
  start: number;
  end: number;
}

export interface DataPositionSelector extends BaseSelector {
  type: 'DataPositionSelector';
  start: number;
  end: number;
}

export interface SVGSelector extends BaseSelector {
  type: 'SVGSelector';
  id?: string;
  value?: string;
}

export interface RangeSelector extends BaseSelector {
  type: 'RangeSelector';
  // startSelector is described in https://www.w3.org/TR/annotation-model/#range-selector
  startSelector?: Selector;
  // endSelector is described in https://www.w3.org/TR/annotation-model/#range-selector
  endSelector?: Selector;
  startContainer: string;
  startOffset: number;
  endContainer: string;
  endOffset: number;
}

export type Selector
  = FragmentSelector
  | CSSSelector
  | XPathSelector
  | TextQuoteSelector
  | TextPositionSelector
  | DataPositionSelector
  | SVGSelector
  | RangeSelector;

export interface AnnotationOption {
  group: string;
  permissions: {
    read: string[];
    admin: string[];
    update: string[];
    delete: string[];
  };
  references?: string;
  tags: string[];
  target: {
    source: string;
    selector: Selector[];
  }[];
  text: string;
  uri: string;
}

export interface Annotation extends AnnotationOption {
  id: string;
  created: string;
  updated: string;
  flagged: boolean;
  user: string;
  hidden: boolean;
  document: {
    title?: string[];
  };
  links: {
    json: string;
    html: string;
    incontext: string;
  };
}