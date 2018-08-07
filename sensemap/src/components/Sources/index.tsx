import * as React from 'react';
import { Grid, Item } from 'semantic-ui-react';
import { ActionProps } from '../../types';
import { Source, SourceData } from './Source';

export interface StateFromProps {
    sources: SourceData[];
}

export type Props = StateFromProps & ActionProps;

export class Sources extends React.Component<Props> {
    render() {
        const sources = this.props.sources;
        return (
            <Grid container columns={1}>
                <Grid.Column>
                <Item.Group>
                    {sources.map((source, k) => <Source source={source} key={k} />)}
                </Item.Group>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Sources ;