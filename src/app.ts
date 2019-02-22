
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

export default app;

