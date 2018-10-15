import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import { Divider, Button } from 'semantic-ui-react';
import CardContent from '../CardContent';
import BoxContent from '../BoxContent';
import * as T from '../../types';
import * as C from '../../types/sense/card';
import * as B from '../../types/sense/box';
import { noop } from '../../types/utils';
import { isLength } from 'validator';
import './index.css';

type Data
  = T.CardData
  | T.BoxData;

interface Props {
  disabled?: boolean;
  objectType: T.ObjectType;
  data: Data;
  submitText?: string;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  onUpdate? (action: B.Action | C.Action): void;
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
      objectType,
      submitText,
      submitDisabled = false,
      cancelDisabled = false,
      onUpdate = noop,
      onSubmit = noop,
      onCancel = noop,
      data
    } = this.props;

    let content;
    let isContentValid = true;
    switch (objectType) {
      case T.ObjectType.CARD:
        isContentValid = isContentValid && isLength((data as T.CardData).description, { max: 5000 });
        content = (
          <CardContent
            disabled={disabled}
            data={data as T.CardData}
            onKeyUp={this.handleKey}
            onChange={onUpdate}
          />
        );
        break;
      case T.ObjectType.BOX:
        content = (
          <BoxContent
            disabled={disabled}
            data={data as T.BoxData}
            onKeyUp={this.handleKey}
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
                id="inspcetor__cancel-btn"
                disabled={cancelDisabled}
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
              <Button.Or />
              <Button
                positive
                id="inspector__submit-btn"
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