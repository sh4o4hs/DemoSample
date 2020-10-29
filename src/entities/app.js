
let app = {};

app.isChild = false;         // 是否為子視窗
app.decimal = 0;             // 設定小數位數
app.baseURL = '';
app.setting = {};

/**
 * 計時用紀錄
 */
// 歷程 開始遊戲
app.recordStart = {
  category: '開始遊戲'
};

// 歷程 下注
app.recordBet = {
  category: '下注'
};

export default app;

