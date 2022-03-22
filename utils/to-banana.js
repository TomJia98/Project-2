const profanity = require('profanity-util');
//importing the profanity filter we are using to change words with

const bananaWords = [
  //add any new monkey language here
  'banana',
  'tree',
  'Ook!',
  'unga bunga',
  '*mating call*',
  'green banana',
  'red banana',
  'aaah!',
  'Skree!',
  'ooga ooga',
  'woop!',
  'bad sign language',
  'gib me banana',
  '-swings from tree-',
  'human bad',
  'Woo-ga Woot',
  'ghibber',
];

function toBanana(string) {
  let badWords = string.replace(/(\b(\w{1,3})\b(\W|$))/g, '').split(/\s+/); //removes words smaller than 3 from the string, as well as ones with grammar in them

  badWords.pop(); //removes the last item from badwords (is always '  ' and throws errors)

  const newString = profanity.purify(string, {
    replacementsList: bananaWords, //use our selected words
    map: true, //if a word in the original string is repeated, replace with the same banana word
    replace: true, //replaces word instead of hashing them out
    forbiddenList: badWords, //our list of "badWords" to be changed
  });
  return newString;
}

module.exports = { toBanana };
