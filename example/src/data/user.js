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
    fav: ['eat', 'dance']
  }
];

let _ = [];

for (let i = 0; i < 1; i++) {
  arr.forEach((item, j) => {
    _.push({
      key: 'i' + i + 'j' + j,
      name: item.name,
      fav: item.fav,
    });
  });
}

export default _;