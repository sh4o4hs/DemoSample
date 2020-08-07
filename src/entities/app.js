
let app = {};

app.isChild = false;         // 是否為子視窗
app.decimal = 0;             // 設定小數位數
app.baseURL = '';


/**
 * 計時用紀錄
 */
// 歷程 進入遊戲
app.recordEnter = {
  category: '進入遊戲'
};

// 歷程 下注
app.recordBet = {
  category: '下注'
};

export default app;

