
let app = {};

app.isChild = false;         // 是否為子視窗
app.decimal = 0;             // 設定小數位數
app.usePIXI = true;
app.useUI = false;
app.visibleUI = false;

enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
app.Direction = Direction;

let pets = new Set(["Cat", "Dog", "Hamster"]);
pets["species"] = "mammals";

for (let pet in pets) {
  console.log(pet); // "species"
}

for (let pet of pets) {
  console.log(pet); // "Cat", "Dog", "Hamster"
}

export default app;

