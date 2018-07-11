
export const translateAnnotation = env => card => {
  return {
    id: card.id,
    group: card.mapId,
    target: card.target,
    links: {
      json: `${env.HYPOTHESIS_API_ROOT}/annotations/${card.id}`,
      incontext: `${env.HYPOTHESIS_API_ROOT}/annotations/${card.id}`,
    },
    tags: card.tags,
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
