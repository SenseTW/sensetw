import {
  CardType,
  typeToString,
  stringToType,
  cardData,
  isEmpty,
  types,
  updateCardType,
  updateTitle,
  updateSummary,
  updateDescription,
  updateTags,
  updateSaidBy,
  updateStakeholder,
  updateUrl,
} from './card';

describe('types', () => {
  describe('Card', () => {
    describe('functions', () => {
      it('should map card types to strings', () => {
        expect(typeToString(CardType.NOTE)).toBe('NOTE');
        expect(typeToString(CardType.PROBLEM)).toBe('PROBLEM');
        expect(typeToString(CardType.SOLUTION)).toBe('SOLUTION');
        expect(typeToString(CardType.DEFINITION)).toBe('DEFINITION');
        expect(typeToString(CardType.INFO)).toBe('INFO');
      });

      it('should map strings to card typues', () => {
        expect(stringToType('NOTE')).toBe(CardType.NOTE);
        expect(stringToType('PROBLEM')).toBe(CardType.PROBLEM);
        expect(stringToType('SOLUTION')).toBe(CardType.SOLUTION);
        expect(stringToType('DEFINITION')).toBe(CardType.DEFINITION);
        expect(stringToType('INFO')).toBe(CardType.INFO);
      });

      it('should map a unknown string to the INFO card type', () => {
        expect(stringToType('foobar')).toBe(CardType.INFO);
      });

      it('should create a non-empty card data', () => {
        expect(isEmpty(cardData())).toBe(false);
      });
    });

    describe('actions', () => {
      it('should create an action to update the card type', () => {
        const cardType = CardType.NOTE;
        const expectedAction = {
          type: types.UPDATE_CARD_TYPE,
          payload: { cardType },
        };
        expect(updateCardType(cardType)).toEqual(expectedAction);
      });

      it('should create an action to update the card title', () => {
        const title = '1984-02-26';
        const expectedAction = {
          type: types.UPDATE_CARD_TITLE,
          payload: { title },
        };
        expect(updateTitle(title)).toEqual(expectedAction);
      });

      it('should create an action to update the card summary', () => {
        const summary = 'V has come to';
        const expectedAction = {
          type: types.UPDATE_CARD_SUMMARY,
          payload: { summary },
        };
        expect(updateSummary(summary)).toEqual(expectedAction);
      });

      it('should ceate an action to update the card description', () => {
        const description = 'Phantom Pain Incident';
        const expectedAction = {
          type: types.UPDATE_CARD_DESCRIPTION,
          payload: { description },
        };
        expect(updateDescription(description)).toEqual(expectedAction);
      });

      it('should create an action to update card tags', () => {
        const tags = 'afghanistan, central africa, seychelles';
        const expectedAction = {
          type: types.UPDATE_CARD_TAGS,
          payload: { tags },
        };
        expect(updateTags(tags)).toEqual(expectedAction);
      });

      it('should create an action to update the card said-by', () => {
          const saidBy = 'the doctor';
          const expectedAction = {
            type: types.UPDATE_CARD_SAID_BY,
            payload: { saidBy },
          };
          expect(updateSaidBy(saidBy)).toEqual(expectedAction);
      });

      it('should create an action to update the card stakeholder', () => {
        const stakeholder = 'Cipher';
        const expectedAction = {
          type: types.UPDATE_CARD_STAKEHOLDER,
          payload: { stakeholder },
        };
        expect(updateStakeholder(stakeholder)).toEqual(expectedAction);
      });

      it('should create an action to update the card URL', () => {
        const url = 'http://example.com';
        const expectedAction = {
          type: types.UPDATE_CARD_URL,
          payload: { url },
        };
        expect(updateUrl(url)).toEqual(expectedAction);
      });
    });
  });
});