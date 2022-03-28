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
  'banana',
  'Woo Woo Woo',
  '*beats chest*',
  'Skree!',
  'ooga ooga',
  'woop!',
  'bad sign language',
  'gib me banana',
  '*swings from tree*',
  '*hangs upside down*',
  'human bad',
  'Woo-ga Woot',
  'ghibber',
];

function toBanana(string) {
  if (string.length < 3) {
    return string;
  } else {
    //let badWords = string.replace(/(\b(\w{1,3})\b(\W|$))/g, '').split(/\s+/); //removes words smaller than 3 from the string, as well as ones with grammar in them
    //let badWords.pop(); //removes the last item from badwords (is always '  ' and throws errors)
    let badWords = string.split(' ');
    const asd = badWords.filter(function (word) {
      if (word.length > 3) {
        return word;
      } else {
        return;
      }
    });
    const newString = profanity.purify(string, {
      replacementsList: bananaWords, //use our selected words
      map: true, //if a word in the original string is repeated, replace with the same banana word
      replace: true, //replaces word instead of hashing them out
      forbiddenList: asd, //our list of "badWords" to be changed
    });
    return newString;
  }
}
module.exports = { toBanana };
