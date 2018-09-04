import { connect } from 'react-redux';
import { State, actions, ActionProps, mapDispatch, CardData } from '../../types';
import * as CS from '../../types/cached-storage';
import * as CO from '../../components/Sources';
import { uniqBy } from 'ramda';

interface Source {
  title: string;
  url: string;
  description: string;
}

function toSource(card: CardData) {
  return {
    title: card.title || card.url,
    url: card.url,
    description: card.description || '網頁介紹'
  };
}

const uniqByUrl = uniqBy((it: Source) => it.url);

// XXX: move this to server side.
function extractSources(cards: CardData[]) {
  const sources = cards
    .filter(card => card.url.trim() !== '')
    .map(toSource);
  return uniqByUrl(sources);
}

export default connect<CO.StateFromProps, ActionProps>(
  (state: State) => {
    const cards = Array(...Object.values(CS.toStorage(state.senseObject).cards));
    const sources = extractSources(cards);
    return { sources };
  },
  mapDispatch({ actions }),
)(CO.Sources);
