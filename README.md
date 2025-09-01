# 儒家文化2048

这是一个融合了儒家文化元素的2048游戏变种，通过合成方块的方式让玩家在游戏中了解和感受儒家经典文化。

## 游戏介绍

本项目基于经典的2048游戏机制，将数字方块替换为儒家经典相关内容，目前包含两个游戏模式：

1. **合成十三经**：通过合并方块逐步解锁《诗经》《尚书》《礼记》等十三经经典
2. **合成儒家周边**：以《论语》等儒家经典语句为内容，体验儒家思想

当两个相同的方块碰撞时，它们会融合成一个更高阶的方块，同时展示相应的经典内容介绍，让玩家在游戏过程中潜移默化地了解儒家文化。

## 如何运行

1. 克隆本仓库到本地：
   ```
   git clone https://github.com/Happy-Boat/cultural_2048.git
   ```

2. 直接在浏览器中打开 `index.html` 文件即可开始游戏

另一种方法：访问网址https://happy-boat.github.io/cultural_2048/

## 技术实现

- 基于HTML、CSS和JavaScript开发
- 使用原生JavaScript实现游戏核心逻辑
- 采用响应式设计，适配不同设备
- 使用localStorage存储游戏进度和最高分

## 项目结构

```
cultural_2048/
├── index.html           # 游戏主菜单
├── shisanjing.html      # 合成十三经游戏模式
├── lunyu.html           # 合成儒家周边游戏模式
├── style/
│   └── main.css         # 游戏样式
├── js/
│   ├── game_manager.js  # 游戏核心逻辑
│   ├── grid.js          # 网格管理
│   ├── tile.js          # 方块管理
│   └── 其他辅助脚本
├── image_shisanjing/    # 十三经相关图片资源
└── LICENSE.txt          # 开源许可证
```

## 许可证

本项目基于MIT许可证开源，详情参见 [LICENSE.txt](LICENSE.txt)

## 致谢

基于Gabriele Cirulli的2048游戏框架开发，融入了儒家文化元素，旨在传播中华优秀传统文化。
