var arr = [
  {
    name: 'A',
    fav: ['eat', 'drink']
  },

  {
    name: 'B',
    fav: ['eat', 'play']
  },

  {
    name: 'C',
    fav: ['eat', 'play']
  }
];

let _ = [];

for (let i = 0; i < 10; i++) {
  arr.forEach((item, j) => {
    _.push({
      key: 'i' + i + 'j' + j,
      name: item.name,
      fav: item.fav,
    });
  });
}

export default _;