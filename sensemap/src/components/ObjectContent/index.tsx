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
  changeText?: string;
  onUpdate? (action: SB.Action | SC.Action): void;
  // XXX: deprecated
  onChange? (value: Data): void;
  onCancel? (): void;
}

class ObjectContent extends React.PureComponent<Props> {
  handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      case Key.Enter:
        this.handleSave();
        break;
      case Key.Escape:
        this.handleCancel();
        break;
      default:
    }
  }

  handleSave = () => {
    return;
  }

  handleCancel = () => {
    return;
  }

  render() {
    const { objectType, changeText, onUpdate = noop, onCancel, data } = this.props;

    let content;
    switch (objectType) {
      case T.ObjectType.CARD:
        content = (
          <CardContent
            data={data as SC.CardData}
            onKeyUp={this.handleKey}
            onChange={action => onUpdate(action)}
          />
        );
        break;
      case T.ObjectType.BOX:
        content = (
          <BoxContent
            data={data as SB.BoxData}
            onKeyUp={this.handleKey}
            onChange={action => onUpdate(action)}
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
              onClick={() => {
                this.handleCancel();
                if (typeof onCancel === 'function') {
                  onCancel();
                }
              }}
            >
              取消
            </Button>
            <Button.Or />
            <Button positive onClick={this.handleSave}>{changeText || '送出'}</Button>
          </Button.Group>
        </div>
      </div>
    );
  }
}

export default ObjectContent;
