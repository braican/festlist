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

const beerData = require('../data/hillsbrew-2023.json');

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
const festId = 'KDGUgcAaPjrq0RmORBtF';
const festDoc = db.collection('fests').doc(festId);
const beerCollection = festDoc.collection('beers');
const breweryCollection = festDoc.collection('breweries');

let i = 0;

const addBeer = ({ BreweryName, Name, Style, Description, ABV, IBU }) => {
  breweryCollection
    .where('name', '==', BreweryName)
    .get()
    .then(snap => {
      if (snap.empty) {
        return new Promise(resolve => {
          breweryCollection
            .add({
              name: BreweryName,
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
          abv: ABV,
          ibu: IBU,
          style: Style,
          notes: Description,
          rating: '',
        })
        .then(docRef => {
          // eslint-disable-next-line
          console.log(`Beer added: ${docRef.id}`);
          i += 1;
          if (beerData[i]) {
            addBeer(beerData[i]);
          } else {
            console.log('Done');
            process.exit(0);
          }
        });
    });
};

addBeer(beerData[i]);
