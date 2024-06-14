const translatte = require('translatte');


translatte('Bir zamanlar, uzak bir ormanda, hayvanların konuşabildiği ve büyülü şeylerin gerçekleştiği bir yer vardı. ', {to: 'en'}).then(res => {
    console.log(res.text);
}).catch(err => {
    console.error(err);
});
// Ihr sprecht auf Russisch?