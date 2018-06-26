
exports.seed = function(knex, Promise) {
  return knex('object').insert([
    {
      id: '8f479cad-50a1-4604-92cd-df60b0291b9e',
      mapId: 'b2f73daf-e767-4d8d-9506-52589d4fd039',
      x: 593,
      y: 320,
      zIndex: 0,
      objectType: 'CARD',
      cardId: '09f3bf62-7658-4b3e-aec0-559b55c033a6',
      width: 0,
      height: 0,
    },
    {
      id: '4fb35a07-176f-484e-a93d-a9c8d4edc3f3',
      mapId: 'b2f73daf-e767-4d8d-9506-52589d4fd039',
      x: 120,
      y: 219,
      zIndex: 0,
      objectType: 'CARD',
      cardId: '61cfcfc1-1336-4f55-93ba-446bb8eedd4f',
      width: 0,
      height: 0,
    },
    {
      id: '69d82c79-29ec-432c-b935-20a421815fe1',
      mapId: 'b2f73daf-e767-4d8d-9506-52589d4fd039',
      x: 188,
      y: 371,
      zIndex: 0,
      objectType: 'BOX',
      boxId: '10330ced-04b4-46d3-91a6-1d294bb12da3',
      width: 0,
      height: 0,
    },
    {
      id: '40374e51-26b2-4036-ba1e-f9e92bc07865',
      mapId: '63a544b6-36cf-4344-b370-32d451a35b70',
      x: 487,
      y: 133,
      zIndex: 0,
      objectType: 'BOX',
      boxId: '45f2ce6e-603a-4c97-90a5-1965709ef0c1',
      width: 0,
      height: 0,
    }
  ]);
};
