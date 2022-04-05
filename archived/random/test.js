console.log(displayCards({ cards: [4, 3, 3, 2, 5], columns: 4 }));

function displayCards({ cards, columns }) {
  let sum = getArraySum(cards);

  const per_row = sum / columns;
  const obj = {};
  let state = true;
  let i = 0;
  let j = 0;
  while (state) {
    if (!obj[i]) {
      obj[i] = [];
    }
    const current = getArraySum(obj[i]);
    console.log(current);
    if (current !== per_row || current - 1 === per_row) {
      if (getArraySum(obj[i]) + cards[j] <= per_row) {
        obj[i].push(cards[j]);
        cards = removeCertainIndex({ array: cards, item: cards[j] });
      } else if (getArraySum(obj[i]) + cards[j] > per_row) {
        const check = cards.find((num) => num === per_row - getArraySum(obj[i]));
        if (check) {
          obj[i].push(check);
          cards = removeCertainIndex({ array: cards, item: check });
        } else {
          const check1 = cards.find((num) => num === per_row + 1 - getArraySum(obj[i]) || per_row - 1 - getArraySum(obj[i]));
          obj[i].push(check1);
          cards = removeCertainIndex({ array: cards, item: check1 });
        }
      }
    } else {
      i++;
    }

    if (cards.length === 0) {
      state = false;
    } else if (cards.length === 1) {
      obj[i++] = [cards[0]];
    }
    //console.log({obj: obj, array: cards, i: i})
  }

  return obj;
}

function getArraySum(array) {
  let sum = 0;
  for (const num of array) {
    if (typeof num === "number") {
      sum += num;
    } else {
      throw new Error(`Invalid Type passed expected number but got ${typeof num}`);
    }
  }
  return sum;
}

function removeCertainIndex({ array, item }) {
  let i = 0;
  for (const index of array) {
    if (index === item) {
      array.splice(i, 1);
    } else {
      i++;
    }
  }
  return array;
}
