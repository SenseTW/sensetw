import * as React from 'react';
import { Card } from 'semantic-ui-react';
import * as SM from '../../types/sense-map';

interface Props {
  data: SM.CardData;
}

class SenseCard extends React.PureComponent<Props> {
  static defaultProps = {
    data: SM.emptyCardData
  };

  render() {
    const { title, description } = this.props.data;

    return (
      <Card>
        <Card.Content>
          <Card.Header>{title}</Card.Header>
          <Card.Description>{description}</Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default SenseCard;