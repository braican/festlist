const firebase = require('firebase');
require('firebase/firestore');

const config = {
  apiKey: 'AIzaSyBZRKKdCaoEiD1dOk5vycvVoLd1lUA0KxI',
  authDomain: 'braican-beerfest.firebaseapp.com',
  databaseURL: 'https://braican-beerfest.firebaseio.com',
  projectId: 'braican-beerfest',
  storageBucket: 'braican-beerfest.appspot.com',
  messagingSenderId: '768238245367',
  appId: '1:768238245367:web:dd0da4bbbfd0964f',
};

const beerData = require('../data/obf-2022.json');

firebase.initializeApp(config);

/**
 * To import:
 *
 * 1. Create a new document within Firestore for the festival. You'll need a date and a name. Then
 *    update the `festId` variable below with the fest's ID.
 * 2. Modify the record logic below to match the data (presumably you've exported the festival's
 *    sheet into json).
 * 3. Make sure you're running the right version of node (`nvm install`), then run the command:
 *    ```
 *    node ./bin/import-to-firestore.js
 *    ```
 */

const db = firebase.firestore();
const festId = 'Dovy7I55D0SzTge6K2D1';
const festDoc = db.collection('fests').doc(festId);
const beerCollection = festDoc.collection('beers');
const breweryCollection = festDoc.collection('breweries');

beerData.forEach(beerData => {
  const {
    CompanyName,
    Website,
    Name,
    Style,
    Description,
    abv,
    ibu,
    Debut,
    Bitterness,
    Color,
    OtherDetails,
    City,
  } = beerData;

  breweryCollection
    .where('name', '==', CompanyName)
    .get()
    .then(snap => {
      if (snap.empty) {
        return new Promise(resolve => {
          breweryCollection
            .add({
              name: CompanyName,
              city: City,
              website: Website,
            })
            .then(docRef => resolve(docRef.id));
        });
      } else {
        return snap.docs[0].id;
      }
    })
    .then(breweryId => {
      beerCollection
        .add({
          name: Name,
          brewery: breweryId,
          abv: abv,
          ibu: ibu,
          style: Style,
          notes: `${Description}\n${OtherDetails}`,
          rating: '',
          isDebut: Debut,
          bitterness: Bitterness,
          color: Color,
        })
        // eslint-disable-next-line
        .then(docRef => console.log(`Beer added: ${docRef.id}`));
    });
});
