var arr = [
  {
    name: 'A',
    fav: ['eat', 'sex']
  },

  {
    name: 'B',
    fav: ['eat', 'play']
  },

  {
    name: 'C',
    fav: ['sex', 'play']
  },

  {
    name: 'D',
    fav: ['eat', 'sex', 'play']
  },
];

let _ = [];

for (let i = 0; i < 5000; i++) {
  arr.forEach((item, j) => {
    _.push({
      key: 'i' + i + 'j' + j,
      name: item.name,
      fav: item.fav,
    });
  });
}

export default _;