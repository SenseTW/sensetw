import * as React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import * as S from '../../../store';
import * as C from '../../../types/sense/card';
import Card from './index';

storiesOf('Inbox/Card', module)
    .add('basic', () => 
        <Provider store={S.store}>
            <Card card={C.cardData(
                {
                    summary: "網頁摘要!!!!!",
                    title: "網頁標題",
                    url: "https://google.com",
                    tags: "標籤1, 標籤2, 標籤3"
                }
            )} />
        </Provider>
    )
    .add('new card', () => 
        <Provider store={S.store}>
            <Card card={C.emptyCardData} />
        </Provider>
    )