import * as React from 'react';
import { Header, Input } from 'semantic-ui-react';
import * as SB from '../../types/sense-box';

interface Props {
  data: SB.BoxData;
  isEditing: boolean;
  onKeyUp? (e: React.KeyboardEvent<HTMLElement>): void;
  onChange? (action: SB.Action): void;
}

class BoxContent extends React.PureComponent<Props> {
  static defaultProps = {
    data: SB.emptyBoxData,
    isEditing: false
  };

  titleInput: Input | null;

  constructor(props: Props) {
    super(props);

    this.titleInput = null;
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isEditing === false && this.props.isEditing === true) {
      setImmediate(() => {
        if (this.titleInput) {
          this.titleInput.focus();
        }
      });
    }
  }

  render() {
    const { children, data, isEditing, onKeyUp, onChange } = this.props;
    const { title, summary } = data;

    const titleSection =
      isEditing
        ? (
          <Input
            fluid
            transparent
            ref={e => this.titleInput = e}
            placeholder="Box 標題"
            value={title}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SB.updateTitle(e.currentTarget.value))}
          />
        )
        : title;

    const summarySection =
      isEditing
        ? (
          <Input
            fluid
            transparent
            placeholder="Box 描述"
            value={summary}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SB.updateSummary(e.currentTarget.value))}
          />
        )
        : summary;

    return (
      <div className="box-content">
        <Header as="h1" className="box-content__header">
          {titleSection}
        </Header>
        <div className="box-content__summary">
          {summarySection}
        </div>
        {children}
      </div>
    );
  }
}

export default BoxContent;