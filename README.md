# Fest List

Keep track of the beers at beerfests.

## Adding a new Festival

This process is pretty manual at this point.

1. First, make sure you're running the right version of node with `nvm install`.
2. You'll also need some data for the festival - often the festival will have a spreadsheet or something you can export to JSON.
3. Create a new document in the `fests` collection within Firebase (the Firestore Database). For this, you'll need at least  a `name` field, and you can also add an optional date.
4. Open up the import script at `bin/import-to-firestore.js`. Update the `beerData` variable to import the relevant data file, then update the `festId` variable in this script with the document ID of the festival record you just created. You'll also probably need to adjust the script to match your data structure.

## Deploying

This app is hosted with Firebase hosting. To deploy to the hosting environment:

1. Make sure you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed.
2. Log into the Firebase CLI with `firebase login --reauth`.
3. Build the app with `yarn build`.
4. Deploy with `firebase deploy --only hosting`.
