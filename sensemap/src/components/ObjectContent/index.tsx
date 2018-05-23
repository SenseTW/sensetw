import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import { Divider, Button } from 'semantic-ui-react';
import CardContent from '../CardContent';
import BoxContent from '../BoxContent';
import * as T from '../../types';
import * as SC from '../../types/sense-card';
import * as SB from '../../types/sense-box';
import { noop } from '../../types/utils';
import './index.css';

type Data
  = SC.CardData
  | SB.BoxData;

interface Props {
  objectType: T.ObjectType;
  data: Data;
  submitText?: string;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  onUpdate? (action: SB.Action | SC.Action): void;
  onSubmit? (value: Data): void;
  onCancel? (): void;
}

class ObjectContent extends React.PureComponent<Props> {
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
    switch (objectType) {
      case T.ObjectType.CARD:
        content = (
          <CardContent
            data={data as SC.CardData}
            onKeyUp={this.handleKey}
            onChange={onUpdate}
          />
        );
        break;
      case T.ObjectType.BOX:
        content = (
          <BoxContent
            data={data as SB.BoxData}
            onKeyUp={this.handleKey}
            onChange={onUpdate}
          />
        );
        break;
      default:
    }

    return (
      <div className="object-content">
        {content}
        <Divider />
        <div className="object-content__actions">
          <Button.Group>
            <Button
              disabled={cancelDisabled}
              onClick={() => onCancel()}
            >
              取消
            </Button>
            <Button.Or />
            <Button
              positive
              disabled={submitDisabled}
              onClick={() => onSubmit(data)}
            >
               {submitText || '送出'}
            </Button>
          </Button.Group>
        </div>
      </div>
    );
  }
}

export default ObjectContent;
