function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;

  this.startTiles     = 2;
  this.maxValue       = 0;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

const thirteenClassicsInfo = {
    2: "《诗经》是中国古代诗歌的开端，最早的一部诗歌总集，收集了西周初年至春秋中叶（前11世纪至前6世纪）的诗歌，共311篇，其中6篇为笙诗（《南陔》《白华》《华黍》《由庚》《崇丘》《由仪》），反映了周初至周晚期约五百年间的社会面貌。先秦时期称为《诗》，或取整数称《诗三百》，西汉时被尊为儒家经典，始称《诗经》。内容上分为《风》《雅》《颂》三部分，手法上分为《赋》《比》《兴》。《风》是周代各地歌谣；《雅》是周人的正声雅乐，分《小雅》和《大雅》；《颂》是周王庭和贵族宗庙祭祀的乐歌，分《周颂》《鲁颂》和《商颂》。",
    4: "《尚书》，原名书，儒家五经之一，是中国最早的一部历史文献汇编，即上古之书，亦称“书经”，是一部记言的古史，内容大多是有关政治的言论和史事。今存共五十八篇，分为《商书》《周书》《虞书》《夏书》，记录了距今约四千年到二千六百年间虞、夏、商、周时期，涉及政治、宗教、思想、哲学、艺术、法令、天文、地理、军事等诸多领域。",
    8: "《礼记》是儒家“三礼”之一、“五经”之一、“十三经”之一。自东汉郑玄作“注”后，地位日升，至唐代尊为“经”，宋代以后位“三礼”之首。由四十六篇独立文章构成，原有《大戴礼记》与《小戴礼记》，《小戴礼记》即常谓之《礼记》，据传为孔子的七十二弟子及其学生们所作，西汉戴圣所编。详尽记录了周王朝及秦汉之前的政治典制、各类名物制度，以及诸多礼仪，深入探讨了儒家的社会政治理念、天道与人伦观念、心性修养方法和准则等，展现了儒家思想核心精髓及价值观。",
    16: "《周礼》是西周时期周公旦所著，汉代最初名为《周官》，始见于《史记·封禅书》。记载先秦时期社会政治、经济、文化、风俗、礼法诸制，内容极为丰富，是中国文化史之宝库。它是古中国第一部系统、完整叙述国家机构设置、职能分工的专书，涉及古代官制、军制、田制、礼制等国家重要政治制度，以及法律、经济、文化、教育、科技等制度，为我国秦汉以来历代国家机构建制提供了全面参照体系，是记载上古文明的百科全书，在中国古代思想文化史上影响深远。",
    32: "《仪礼》由周公制作，孔子编定，共十七篇。内容记载周代的冠、婚、丧、祭、乡、射、朝、聘等各种礼仪制度，以记载士大夫的礼仪为主。在古代中国，祭祀等原始宗教仪式转化为礼仪、制度形式约束世道人心，《仪礼》是一部详细的礼仪制度章程，规定了不同场合的着装、站位及具体行为步骤。",
    64: "《孟子》一书共七篇，是战国时期孟子的言论汇编，记录了孟子与其他各家思想的争辩、对弟子的言传身教、游说诸侯等内容，由孟子及其弟子（万章等）共同编撰而成。记录了孟子的治国思想、政治策略（仁政、王霸之辨、民本、格君心之非，民为贵社稷次之君为轻）和政治行动，成书大约在战国中期，属儒家经典著作。",
    128: "《论语》是春秋时期孔子的弟子及再传弟子记录孔子及其弟子言行而编成的语录体文集，成书于战国前期。全书共20篇492章，以语录体为主，叙事体为辅，较为集中地体现了孔子及儒家学派的政治主张、伦理思想、道德观念、教育原则等。语言简练，浅近易懂，用意深远，有一种雍容和顺、纡徐含蓄的风格，能在简单对话和行动中展示人物形象。自宋代以后，被列为“四书”之一，成为古代学校官定教科书和科举考试必读书。",
    256: "《周易》包括《易经》和《易传》，与《连山》《归藏》并为“三易”。其形成“人更三圣，世历三古”：上古伏羲留天地之象；中古周文王演《易经》之道；近古孔子及弟子后学注《易经》而成《易传》，经传合一终成《周易》。它是中国传统思想文化中自然哲学与人文实践的理论根源，是古代汉民族思想、智慧的结晶，被誉为“大道之源”，内容丰富，对中国几千年来的政治、经济、文化等各个领域都产生了极其深刻的影响。",
    512: "《左传》卷帙浩繁，内容庞杂，涉及政治、经济、军事、外交、天文、地理、农业、医学、习俗、文艺等诸多领域，将春秋甚至更为久远年代的社会文化与生活形态清晰展示给读者。在十二代鲁君纪年的编年纪事中，讲解了《春秋》经的“春秋笔法”，记述了鲁国以外多个国家的史事，扩展了《春秋》的国家区域范围。通过历史人物对话、文书档案转录、历史亲历者转述细节及贤人评论组成叙事结构系统，还借历史人物之口引用儒家经典，在叙史同时帮助解读经典文辞，阐述儒家治国理念，可谓亦经亦史。",
    1024: "《公羊传》是注释《春秋》的书，旧题为战国时代公羊高撰。据唐代徐彦《公羊传疏》引戴宏序，它最初由公羊高口述，代代流传，至汉景帝时由公羊高之玄孙公羊寿和胡母生(子都)“著于竹帛”成书。阐述《春秋》中的“微言大义”，是儒家重要经典之一。记述史事简略，在阐发“诛乱臣贼子”之“大义”和“为后王立法”之“微言”方面具体翔实。历代今文经学家视其为重要经籍，也常用它议论政治，是研究战国、秦、汉间儒家思想的重要资料。",
    2048: "《谷梁传》，又称《穀梁传》，是为《春秋》作注解所著，为儒家经典之一。传说孔子弟子子夏将内容口头传给穀梁俶（亦名穀梁赤，字元始），穀梁赤写成书记录下来，但实际上成书时间在西汉。着重宣扬儒家思想，务礼义教化和宗法情谊，为缓和统治集团内部矛盾、稳定封建统治长远利益服务，受到统治阶级重视，是研究秦汉间及西汉初年儒家思想的重要资料。",
    4096: "《孝经》记载了孔子向曾子讲述孝道的言论，相传为孔子或曾子所作，孔子最初讲述可能零散，最终由曾子和曾子的学生整理为系统化书籍。篇幅短小，全书一千八百几十字，分为十八章。主要内容是孔子与曾子对话，将“孝”定义为所有道德的基础、教化产生的源头，论述了孝的终始、天子至庶人的孝道、孝的重要性等问题。受到历代封建统治者尊崇，汉文帝时设《孝经》博士，清代科举仍加试《孝经》，传至海外也产生巨大影响，对规范社会伦理道德仍有重要作用。",
    8192: "《尔雅》是第一部字辞书，“尔”为近之意（亦作“迩”），“雅”，正也，即接近雅言，雅正之言。成书于战国或两汉之间，上限不早于战国，下限不晚于西汉，因书中资料有的来自战国后作品，且汉文帝时已设《尔雅》博士，汉武帝时出现犍为文学的《尔雅注》。它是我国第一部按义类编排的综合性辞书，是疏通包括五经在内的上古文献中词语古文的重要工具书。在文字训诂学方面贡献巨大，后世训诂学、音韵学等著作基本遵循其体例，还出现许多仿照它的“群雅”著作，研究它产生了“雅学”。"
};

const lunyuInfo = {
    2: `子路曰：“负重道远者不择地而休，家贫亲老者不择禄而仕。昔者由事二亲之时，常食藜藿之实，而为亲负米百里之外。亲没之后，南游于楚，从车百乘，积粟万钟。累茵而坐，列鼎而食，愿食藜藿为亲负米之时，不可复得也。”
——汉·刘向《说苑·建本》

子路负米的故事是二十四孝之一。`,
    4: `"点，尔何如？"
鼓瑟希，铿尔，舍瑟而作，对曰："异乎三子者之撰。"
子曰："何伤乎？亦各言其志也！"
曰："莫春者，春服既成，冠者五六人，童子六七人，浴乎沂，风乎舞雩，咏而归。"
夫子喟然叹曰："吾与点也。"
——《论语·先进》

曾点的"浴乎沂，风乎舞雩，咏而归"，是儒家理想的治世图景。`,
    8: `子曰："贤哉，回也！一箪食，一瓢饮，在陋巷，人不堪其忧，回也不改其乐。贤哉，回也！"
——《论语·雍也》

颜回是儒家安贫乐道的典范。`,
    16: `子贡问曰："赐也何如？"
子曰："女，器也。"
曰："何器也？"
曰："瑚琏也。"
——《论语·公冶长》

瑚琏是古代国家举行大典时用的一种贵重而华美的玉制祭器，平常供在庙堂，精美洁净而庄严。此处孔子把子贡比作瑚琏，是说他才智出众，堪当重任。但是瑚琏只在国家大典之时才请出来亮一下相，平时只能锁在柜子里保护起来。所以这句话是孔子对子贡的激励，也暗含着对子贡的启示：假如一个人只像瑚琏那样，即使高贵无比，但大部分时间都被珍藏，毕竟有些遗憾。这里蕴含着君子不器的道理。`,
    32: `"赤，尔何如？"
对曰："非曰能之，愿学焉。宗庙之事，如会同，端章甫，愿为小相焉。"
——《论语·先进》

"端"特指周代玄端礼服，乃士大夫阶层的正式着装，"甫"同"章甫"，是周朝贵族在祭祀、朝会等重要场合佩戴的礼冠。二字组合完整呈现古代礼仪服饰体系的核心要素，体现了"衣冠为礼器之本"的传统礼制观念。这里也蕴含着公西华以礼治国的思想。`,
    64: `孔子过泰山侧，有妇人哭于墓者而哀。夫子式而听之，使子路问之曰:"子之哭也，壹似重有忧者。"而曰:"然。昔者吾舅死于虎，吾夫又死焉，今吾子又死焉。"夫子曰:"何为不去也?"曰:"无苛政。"夫子曰:"小子识之，苛政猛于虎也。"
——西汉·戴圣《礼记·檀弓下》

苛政猛如虎。`,
    128: `鱼，我所欲也；熊掌，亦我所欲也。二者不可得兼，舍鱼而取熊掌者也。生，亦我所欲也；义，亦我所欲也。二者不可得兼，舍生而取义者也。
——《孟子·告子上》

漂亮的类比（比喻）论证。`,
    256: `子曰："为政以德，譬如北辰，居其所而众星共之。"
——《论语·为政》

北辰星位于天空中的固定位置，从古代开始就被人们用作导航的参照物，它被孔子用来强调德行的高尚和确立道德标准的重要性。`,
    512: `子曰："礼云礼云，玉帛云乎哉！乐云乐云，钟鼓云乎哉！"
——《论语·阳货》

真正的礼乐不在器物，在人心中。`,
    1024: `"（孔子）过于盗泉，渴矣而不饮，恶其名也。"
——战国·尸佼《尸子》

高尚品格的典范。`,
    2048: `"孔子晚而喜《易》，序彖、系、象、说卦、文言。读《易》，韦编三绝。"
——西汉·司马迁《史记·孔子世家》

夫子读书，韦编三绝。`,
    4096: `"孔子游乎缁帷之林，休坐乎杏坛之上。弟子读书，孔子弦歌鼓琴。"
——战国·庄周《庄子·渔父》

杏坛相传为孔子聚徒授业讲学处。后人因庄子寓言，在山东省曲阜市孔庙大成殿前，为之筑坛、建亭、书碑、植杏。`,
    8192: `北京孔庙，又名"先师庙"，位于北京东城区安定门内国子监街13号，为中国古代元、明、清三朝祭祀孔子的场所。 
始建于元大德六年（1302年）六月，大德十年（1306年）建成，面积2.2万平方米，明永乐九年（1411年）重建。
北京孔庙坐北朝南，古建筑面积约有7400平方米。主体建筑为沿中轴线分布，左右对称的中国传统建筑布局，三进院落，中轴线上的建筑从南向北依次为先师门、大成门、大成殿、崇圣门及崇圣祠，主体建筑都覆以黄色琉璃瓦。
清光绪三十二年（1906年），北京孔庙大规模修缮，民国五年（1916年）竣工。至此孔庙形成现有的规模和布局。
北京孔庙进士题名碑为研究中国古代科举制度的重要文献资料。孔庙历经700多年的历史文化积淀，遗留下来的文物，成为研究中国古代科举、孔子儒学、建筑形式和文化内涵的重要史料和实物。`
};

// Restart the game
GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.storageManager.clearMaxValue(this.mode);
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

// Set up the game
GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();

  // 直接使用 StorageManager 在构造时通过 detectMode() 判定的模式
  this.mode = this.storageManager.mode;

  // 先读取持久化的 maxValue（无论是否有 previousState）
  if (this.mode === "shisanjing") {
    this.maxValue = parseInt(this.storageManager.getMaxValue_shisanjing()) || 0;
  } else {
    this.maxValue = parseInt(this.storageManager.getMaxValue_lunyu()) || 0;
  }

  if (previousState) {
    this.grid        = new Grid(previousState.grid.size, previousState.grid.cells);
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // Add the initial tiles
    this.addStartTiles();
    this.showInfoPopup(2);
    }

    // Update the actuator
    this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};


GameManager.prototype.showInfoPopup = function (value) {

  // 判断当前页面是否为 shisanjing.html
  const isShisanjingPage = window.location.href.includes('shisanjing.html');
  if (isShisanjingPage) {
    const info = thirteenClassicsInfo[value];
  
    // 创建遮罩层（背景变暗效果）
    const overlay = document.createElement('div');
    overlay.classList.add('popup-overlay');
  
    // 创建弹窗容器
    const popup = document.createElement('div');
    popup.classList.add('info-popup');
  
    // 关闭按钮
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => {
      // 添加关闭动画
      popup.classList.remove('active');
      overlay.classList.remove('active');
      
      // 动画结束后移除元素
      setTimeout(() => {
        popup.remove();
        overlay.remove();
      }, 300);
    });
  
    // 点击遮罩层也可以关闭弹窗
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeButton.click();
      }
    });
  
    // 标题
    const title = document.createElement('h2');
    title.textContent = `《${this.getClassicName(value)}》`;
  
    // 图片元素
    const img = document.createElement('img');
    img.classList.add('popup-image');
    img.src = `image_shisanjing/${value}.jpg`;
    img.alt = `${value} 对应的十三经图片`;
  
    // 图片加载失败时的处理
    img.onerror = () => {
      img.src = 'default-image.jpg'; // 替换为你的默认图片路径
      img.alt = '图片加载失败';
    };
  
    // 内容文本
    const content = document.createElement('p');
    content.textContent = info;
  
    // 组装弹窗
    popup.appendChild(closeButton);
    popup.appendChild(title);
    popup.appendChild(img);
    popup.appendChild(content);
  
    // 添加到页面
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
  
    // 触发动画（需要延迟以确保浏览器捕获到样式变化）
    setTimeout(() => {
      popup.classList.add('active');
      overlay.classList.add('active');
    }, 10);
  }
  else {
    const info = lunyuInfo[value];
  
    // 创建遮罩层（背景变暗效果）
    const overlay = document.createElement('div');
    overlay.classList.add('popup-overlay');
  
    // 创建弹窗容器
    const popup = document.createElement('div');
    popup.classList.add('info-popup');
  
    // 关闭按钮
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => {
      // 添加关闭动画
      popup.classList.remove('active');
      overlay.classList.remove('active');
      
      // 动画结束后移除元素
      setTimeout(() => {
        popup.remove();
        overlay.remove();
      }, 300);
    });
  
    // 点击遮罩层也可以关闭弹窗
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeButton.click();
      }
    });
  
    // 标题
    const title = document.createElement('h2');
    title.textContent = `${this.getLunyuName(value)}`;
  
    // 图片元素
    const img = document.createElement('img');
    img.classList.add('popup-image');
    img.src = `image_lunyu/${value}.jpg`;
    img.alt = `${value} 对应的论语图片`;
  
    // 图片加载失败时的处理
    img.onerror = () => {
      img.src = 'default-image.jpg'; // 替换为你的默认图片路径
      img.alt = '图片加载失败';
    };
  
    // 内容文本 - 使用pre-line保留换行
    const content = document.createElement('p');
    content.classList.add('lunyu-text'); // 添加CSS类
    content.textContent = info; // 使用textContent保留原始格式
  
    // 组装弹窗
    popup.appendChild(closeButton);
    popup.appendChild(title);
    popup.appendChild(img);
    popup.appendChild(content);
  
    // 添加到页面
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
  
    // 触发动画（需要延迟以确保浏览器捕获到样式变化）
    setTimeout(() => {
      popup.classList.add('active');
      overlay.classList.add('active');
    }, 10);
  }
};

GameManager.prototype.getClassicName = function (value) {
  const names = {
    2: "诗经",
    4: "尚书",
    8: "礼记",
    16: "周礼",
    32: "仪礼",
    64: "孟子",
    128: "论语",
    256: "周易",
    512: "左传",
    1024: "公羊传",
    2048: "谷梁传",
    4096: "孝经",
    8192: "尔雅"
  };
  return names[value] || `十三经（${value}）`;
};

GameManager.prototype.getLunyuName = function (value) {
  const names = {
    2: "子路的米",
    4: "曾点的瑟",
    8: "颜回的巷",
    16: "赐的瑚琏",
    32: "赤的端甫",
    64: "泰山的虎",
    128: "鱼和熊掌",
    256: "北极的星",
    512: "晨钟暮鼓",
    1024: "一眼盗泉",
    2048: "夫子的简",
    4096: "丘的杏坛",
    8192: "圣人的庙"
  };
  return names[value] || `论语（${value}）`;
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
    if (this.mode === "shisanjing") {
      this.storageManager.setMaxValue_shisanjing(this.maxValue);
    }
    else{
      this.storageManager.setMaxValue_lunyu(this.maxValue);
    }
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 8192 tile
          if (merged.value === 8192) self.won = true;

          // 检查是否是新纪录数字并弹出窗口
          if (merged.value > self.maxValue && thirteenClassicsInfo[merged.value]) {
            self.maxValue = merged.value; // 更新最大数字
            self.showInfoPopup(merged.value);
          }
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
