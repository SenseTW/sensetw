import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import { Divider, Button } from 'semantic-ui-react';
import CardContent from '../CardContent';
import BoxContent from '../BoxContent';
import EdgeContent from '../EdgeContent';
import * as T from '../../types';
import * as C from '../../types/sense/card';
import * as B from '../../types/sense/box';
import * as E from '../../types/sense/edge';
import { noop } from '../../types/utils';
import { isLength } from 'validator';
import './index.css';

export const SUMMARY_LIMIT = 255;
export const EDGE_SUMMARY_LIMIT = 150;

type Data
  = T.CardData
  | T.BoxData
  | T.Edge;

interface Props {
  disabled?: boolean;
  selectionType: T.SelectionType;
  data: Data;
  submitText?: string;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  onUpdate? (action: B.Action | C.Action | E.Action): void;
  onSubmit? (value: Data): void;
  onCancel? (): void;
}

class Inspector extends React.PureComponent<Props> {
  handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { data, onSubmit = noop, onCancel = noop } = this.props;

    switch (e.keyCode) {
      case Key.Enter:
        onSubmit(data);
        break;
      case Key.Escape:
        onCancel();
        break;
      default:
    }
  }

  render() {
    const {
      disabled = false,
      selectionType,
      submitText,
      submitDisabled = false,
      cancelDisabled = false,
      onUpdate = noop,
      onSubmit = noop,
      onCancel = noop,
      data
    } = this.props;

    let mode;
    let content;
    let isContentValid = true;
    switch (selectionType) {
      case T.SelectionType.MAP_CARD:
      case T.SelectionType.INBOX_CARD:
        mode = 'sense-card-inspector';
        isContentValid =
          isContentValid &&
          isLength((data as T.CardData).summary, { max: SUMMARY_LIMIT });
        content = (
          <CardContent
            disabled={disabled}
            data={data as T.CardData}
            onKeyUp={this.handleKey}
            onChange={onUpdate}
          />
        );
        break;
      case T.SelectionType.MAP_BOX:
        mode = 'sense-box-inspector';
        isContentValid =
          isContentValid &&
          isLength((data as T.BoxData).summary, { max: SUMMARY_LIMIT });
        content = (
          <BoxContent
            disabled={disabled}
            data={data as T.BoxData}
            onKeyUp={this.handleKey}
            onChange={onUpdate}
          />
        );
        break;
      case T.SelectionType.MAP_EDGE:
        mode = 'sense-edge-inspector';
        isContentValid =
          isContentValid &&
          isLength((data as T.Edge).summary, { max: EDGE_SUMMARY_LIMIT });
        content = (
          <EdgeContent
            disabled={disabled}
            data={data as T.Edge}
            onChange={onUpdate}
          />
        );
        break;
      default:
    }

    return (
      <div className="inspector">
        <div className="inspector__content">
          {content}
        </div>
        {!disabled && <Divider />}
        {
          !disabled &&
          <div className="inspector__actions">
            <Button.Group>
              <Button
                id={`${mode}__cancel-btn`}
                disabled={cancelDisabled}
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
              <Button.Or />
              <Button
                positive
                id={`${mode}__update-btn`}
                disabled={submitDisabled || !isContentValid}
                onClick={() => onSubmit(data)}
              >
                {submitText || 'Save'}
              </Button>
            </Button.Group>
          </div>
        }
      </div>
    );
  }
}

export default Inspector;
