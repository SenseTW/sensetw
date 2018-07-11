
export const translateAnnotation = env => card => {
  return {
    id: card.annotationID,
    group: card.mapId,
    target: card.target,
    links: {
      json: `${env.HYPOTHESIS_API_ROOT}/annotations/${card.annotationID}`,
      incontext: `${env.HYPOTHESIS_API_ROOT}/annotations/${card.annotationID}`,
    },
    tags: card.tags.split(/,\s*/).filter(t => !!t),
    text: card.summary,
    created: card.createdAt,
    uri: card.url,
    flagged: false,
    user_info: {
      display_name: null,
    },
    user: '',
    hidden: false,
    permissions: {
      read: [ 'group:__world__' ],
    },
  };
}
