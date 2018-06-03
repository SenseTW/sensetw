import * as React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import * as S from '../../store';
import * as C from '../../types/sense/card';
import * as B from '../../types/sense/box';
import * as T from '../../types';
import ObjectContent from './index';

storiesOf('Inspector', module)
    .add('when selected an empty card', () => 
        <Provider store={S.store}>
            <ObjectContent objectType={T.ObjectType.CARD} data={C.emptyCardData} />
        </Provider>
    )
    .add('when selected an empty box', () => 
        <Provider store={S.store}>
            <ObjectContent objectType={T.ObjectType.BOX} data={B.emptyBoxData} />
        </Provider>
    );