import * as React from 'react';
import { Button, Item } from 'semantic-ui-react';

export interface SourceData {
    title: string;
    url: string;
    description: string;
}

export type Props = {
    source: SourceData
};

export function Source ({source}: Props) {
    return (
        <Item>
        <Item.Image size="tiny" src="https://react.semantic-ui.com/images/wireframe/image.png" />
        <Item.Content>
            <Item.Header 
                as="a" 
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
            >
            {source.title}
            </Item.Header>
            <Item.Meta>Description</Item.Meta>
            <Item.Description>
                {source.description || '網頁介紹'}
            </Item.Description>
            <Item.Extra>
            <Button
                id="sense-sources__annotation-btn"
                size="tiny"
                as="a" 
                href={'https://via.sense.tw/' + source.url}
                target="_blank"
                rel="noopener noreferrer"
            >
            註記
            </Button>
            </Item.Extra>
        </Item.Content>
        </Item>
    );
}

export default Source;