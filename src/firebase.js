import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import config from './config';

firebase.initializeApp(config);

// Base
export const db = firebase.firestore();
export const auth = firebase.auth();
export const authProvider = new firebase.auth.GoogleAuthProvider();

// Collections
export const usersCollection = db.collection('users');
