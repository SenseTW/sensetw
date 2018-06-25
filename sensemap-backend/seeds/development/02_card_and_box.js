
exports.seed = function(knex, Promise) {
  return knex('card').insert([
      {
        id: '09f3bf62-7658-4b3e-aec0-559b55c033a6',
        title: 'foo',
        cardType: 'NORMAL',
        mapId: 'b2f73daf-e767-4d8d-9506-52589d4fd039',
      },
      {
        id: '61cfcfc1-1336-4f55-93ba-446bb8eedd4f',
        title: 'bar',
        cardType: 'QUESTION',
        mapId: 'b2f73daf-e767-4d8d-9506-52589d4fd039',
      },
      {
        id: '056dc833-7845-4415-bd32-3abee8705527',
        title: 'baz',
        cardType: 'ANSWER',
        mapId: '63a544b6-36cf-4344-b370-32d451a35b70',
      },
    ])
    .then(function () {
      return knex('box').insert([
        {
          id: '10330ced-04b4-46d3-91a6-1d294bb12da3',
          title: 'woot',
          mapId: 'b2f73daf-e767-4d8d-9506-52589d4fd039',
        },
        {
          id: '45f2ce6e-603a-4c97-90a5-1965709ef0c1',
          title: 'yo',
          mapId: '63a544b6-36cf-4344-b370-32d451a35b70',
        },
      ]);
    });
};
