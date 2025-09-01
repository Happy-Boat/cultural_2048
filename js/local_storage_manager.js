window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  // 检测当前模式
  this.detectMode();
  
  // 根据模式设置不同的存储键
  this.bestScoreKey = this.mode + "_bestScore";
  this.gameStateKey = this.mode + "_gameState";

  this.maxValue_shisanjing = "shisanjing_maxValue";  // 十三经模式maxValue键
  this.maxValue_lunyu = "lunyu_maxValue";            // 论语模式maxValue键


  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

// 检测当前是哪种游戏模式
LocalStorageManager.prototype.detectMode = function() {
  // 检查body是否有论语模式的类
  if (document.body && document.body.classList.contains('lunyu-game')) {
    this.mode = 'lunyu';
  } else {
    // 默认十三经模式
    this.mode = 'shisanjing';
  }
};

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";

  try {
    var storage = window.localStorage;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};

LocalStorageManager.prototype.setMaxValue_shisanjing = function (maxValue) {
  this.storage.setItem(this.maxValue_shisanjing, maxValue);
};

LocalStorageManager.prototype.getMaxValue_shisanjing = function () {
  return this.storage.getItem(this.maxValue_shisanjing);
};

LocalStorageManager.prototype.setMaxValue_lunyu = function (maxValue) {
  this.storage.setItem(this.maxValue_lunyu, maxValue);
};

LocalStorageManager.prototype.getMaxValue_lunyu = function () {
  return this.storage.getItem(this.maxValue_lunyu);
};

LocalStorageManager.prototype.setMode = function (mode) {
  this.storage.setItem(this.mode, mode);
}

LocalStorageManager.prototype.getMode = function () {
  return this.storage.getItem(this.mode) || 'shisanjing';
}