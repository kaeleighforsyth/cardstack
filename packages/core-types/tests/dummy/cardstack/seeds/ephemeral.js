/* eslint-env node */
const JSONAPIFactory = require('@cardstack/test-support/jsonapi-factory');
const { camelize, dasherize } = require('inflection');
const log = require('@cardstack/logger')('core-types::seeds');

function initialModels() {
  let initial = new JSONAPIFactory();


  initial.addResource('content-types', 'drivers')
  .withAttributes({
    defaultIncludes: [
      'feeling',
      'vehicle',
      'alternate-vehicle',
      'tracks'
    ]
  })
  .withRelated('fields', [
    initial.addResource('fields', 'name').withAttributes({
      fieldType: '@cardstack/core-types::string'
    }),
    initial.addResource('fields', 'dob').withAttributes({
      fieldType: '@cardstack/core-types::date'
    }),
    initial.addResource('fields', 'latest-victory').withAttributes({
      fieldType: '@cardstack/core-types::date',
      editorComponent: 'field-editors/datetime-editor'
    }),
    initial.addResource('fields', 'is-good-guy').withAttributes({
      fieldType: '@cardstack/core-types::boolean'
    }),
    initial.addResource('fields', 'feeling').withAttributes({
      fieldType: '@cardstack/core-types::belongs-to',
      editorComponent: 'field-editors/dropdown-choices-editor'
    }).withRelated('related-types', [
      initial.addResource('content-types', 'feelings')
      .withRelated('fields', [
        initial.addResource('fields', 'title').withAttributes({ fieldType: '@cardstack/core-types::string' })
      ])
    ]),
    initial.addResource('fields', 'vehicle').withAttributes({
      fieldType: '@cardstack/core-types::belongs-to',
      editorComponent: 'field-editors/dropdown-choices-editor',
      editorOptions: { displayFieldName: 'name' }
    }).withRelated('related-types', [
      initial.addResource('content-types', 'vehicles')
      .withRelated('fields', [
        initial.addResource('fields', 'name').withAttributes({ fieldType: '@cardstack/core-types::string' })
      ])
    ]),
    initial.addResource('fields', 'alternate-vehicle').withAttributes({
      fieldType: '@cardstack/core-types::belongs-to',
      editorComponent: 'field-editors/dropdown-choices-editor',
      editorOptions: { displayFieldName: 'name' }
    }).withRelated('related-types', [
      { type: 'content-types', id: 'vehicles' }
    ]),
    initial.addResource('fields', 'tracks').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-multi-select-editor',
    }).withRelated('related-types', [
      initial.addResource('content-types', 'tracks')
      .withRelated('fields', [
        initial.addResource('fields', 'title').withAttributes({ fieldType: '@cardstack/core-types::string' })
      ])
    ]),
    initial.addResource('fields', 'races').withAttributes({
      fieldType: '@cardstack/core-types::has-many',
      editorComponent: 'field-editors/dropdown-multi-select-editor',
      editorOptions: { displayFieldName: 'name' }
    }).withRelated('related-types', [
      initial.addResource('content-types', 'races')
        .withRelated('fields', [
          initial.addResource('fields', 'name').withAttributes({ fieldType: '@cardstack/core-types::string' })
        ])
    ])
  ]);

  let happyFeeling = initial.addResource('feelings', '1').withAttributes({ title: 'Happy' });
  let sadFeeling = initial.addResource('feelings', '2').withAttributes({ title: 'Sad' });
  let exuberantFeeling = initial.addResource('feelings', '3').withAttributes({ title: 'Exuberant' });
  initial.addResource('feelings', '4').withAttributes({ title: 'Melancholy' });

  let sportBikeVehicle = initial.addResource('vehicles', '1').withAttributes({ name: 'Sport Bike' });
  let standardKartVehicle = initial.addResource('vehicles', '2').withAttributes({ name: 'Standard Kart' });
  initial.addResource('vehicles', '3').withAttributes({ name: 'Honeycoupe' });
  initial.addResource('vehicles', '4').withAttributes({ name: 'Wild Wiggler' });

  let tracks = {};
  ['Mario Kart Stadium', 'Mario Circuit', 'Sunshine Airport', 'Cloudtop Cruise', 'GCN Yoshi Circuit', 'GCN Baby Park',
  'Water Park', 'Toad Harbor', 'Dolphin Shoals', 'Bone Dry Dunes', 'Excitebike Arena', 'Wild Woods',
  'Sweet Sweet Canyon', 'Twisted Mansion', 'Electrodrome', 'Bowsers Castle', 'Dragon Driftway', 'GBA Cheese Land',
  'Thwomp Ruins', 'Shy Guy Falls', 'Mount Wario', 'Rainbow Road', 'Mute City', 'Animal Crossing'].forEach(track => {
    let trackId = dasherize(track.toLowerCase());
    let trackVar = camelize(track.replace(/ /g, ''), true);
    log.info(`Creating ${trackVar} with id ${trackId} for track ${track}`);
    tracks[trackVar] = initial.addResource('tracks', trackId).withAttributes({ title: track });
  });

  let race1 = initial.addResource('races', 'race-1').withAttributes({ name: 'Race 1' });
  let race2 = initial.addResource('races', 'race-2').withAttributes({ name: 'Race 2' });
  initial.addResource('races', 'race-3').withAttributes({ name: 'Race 3' });

  initial.addResource('drivers', 'kingboo')
    .withAttributes({
      name: 'King Boo',
      dob: '1998-01-21',
      latestVictory: '2018-10-24T13:56:05',
      isGoodGuy: false
    })
    .withRelated('feeling', exuberantFeeling)
    .withRelated('vehicle', standardKartVehicle)
    .withRelated('tracks', [ tracks.twistedMansion ]);

    initial.addResource('drivers', 'metalmario')
    .withAttributes({
      name: 'Metal Mario',
      dob: '1999-01-01',
      latestVictory: '2018-10-25T13:56:05',
      isGoodGuy: true
    })
    .withRelated('feeling', happyFeeling)
    .withRelated('vehicle', sportBikeVehicle)
    .withRelated('alternate-vehicle', standardKartVehicle)
    .withRelated('tracks', [ tracks.rainbowRoad, tracks.sweetSweetCanyon, tracks.toadHarbor ])
    .withRelated('races', [ race1, race2 ]);

    initial.addResource('drivers', 'link')
    .withAttributes({
      name: 'Link',
      dob: '2003-01-01',
      latestVictory: '2018-10-23T13:56:05',
      isGoodGuy: true
    })
    .withRelated('feeling', happyFeeling)
    .withRelated('vehicle', sportBikeVehicle);

    initial.addResource('drivers', 'shyguy')
    .withAttributes({
      name: 'Shy Guy',
      dob: '2001-01-01',
      isGoodGuy: false
    })
    .withRelated('feeling', sadFeeling)
    .withRelated('vehicle', sportBikeVehicle);

  return initial.getModels();
}

module.exports = initialModels();
