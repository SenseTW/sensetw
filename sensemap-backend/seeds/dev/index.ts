exports.seed = function (knex, Promise) {
  // noop
  return Promise.resolve();
};

exports.maps = [
  {
    id: 'b2f73daf-e767-4d8d-9506-52589d4fd039',
    objects: [
      { id: '8f479cad-50a1-4604-92cd-df60b0291b9e' },
    ],
    boxes: [
      { id: '10330ced-04b4-46d3-91a6-1d294bb12da3' },
    ],
    cards: [
      { id: '61cfcfc1-1336-4f55-93ba-446bb8eedd4f' },
    ],
    edges: [
      { id: '041c1000-5af7-458a-97f5-e7a748021882' },
    ],
  },
  {
    id: '63a544b6-36cf-4344-b370-32d451a35b70'
  },
];

exports.boxes = [
  {
    id: '10330ced-04b4-46d3-91a6-1d294bb12da3',
    map: 'b2f73daf-e767-4d8d-9506-52589d4fd039',
  },
  {
    id: '45f2ce6e-603a-4c97-90a5-1965709ef0c1',
    map: '63a544b6-36cf-4344-b370-32d451a35b70',
  },
];

exports.annotations = [
  {
    id: '65524a44-7346-46c3-b04a-6a00836d8feb',
  },
];
