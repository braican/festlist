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

const beerData = require('../data/or-brewers-fest-2019.json');

firebase.initializeApp(config);

const db = firebase.firestore();
const festId = '8Cr6aA3ECFPeuxPWVSp8';
const festDoc = db.collection('fests').doc(festId);
const beerCollection = festDoc.collection('beers');
const breweryCollection = festDoc.collection('breweries');

beerData.beers.forEach(beerData => {
  const { beer, brewery, city, style, description, abv, ibu, trailer } = beerData;

  breweryCollection.where('name', '==', brewery).get()
    .then(snap => {
      if (snap.empty) {
        return new Promise(resolve => {
          breweryCollection.add({ name: brewery, city }).then(docRef => resolve(docRef.id));
        });
      } else {
        return snap.docs[0].id;
      }
    })
    .then(breweryId => {
      beerCollection.add({
        name: beer,
        brewery: breweryId,
        abv,
        ibu,
        style,
        notes: description,
        rating: '',
        location: trailer,
      }).then(docRef => console.log(`Beer added: ${docRef.id}`));
    });
});





