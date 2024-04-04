# 人生重啟遊戲： 一款改變人生的習慣養成卡牌戰鬥遊戲

## 遊戲介紹

> 習慣是一種頑強而巨大的力量，他可以主宰人生。——培根

準備在新一年中培養全新的習慣了嗎？總是在開始後不久就放棄嗎？「人生重啟遊戲」結合了習慣養成與卡牌遊戲的元素，不僅是一款習慣養成應用，更是一場引人入勝的卡牌冒險。通過完成習慣目標，獲得金幣和經驗值來收集卡牌和裝備，每天參與精彩的卡牌對戰！加入我們，一起打造新的習慣，改變生活！

## 安裝方式

### 本機安裝

```
docker-compose up -d
yarn
cp .env.example .env.local # fill the secrets
yarn migrate
yarn dev
```

### 預設資料

```
cd data
# 準備好你的 csv (依照 /data 下的範例格式)
./convert_all_schema.sh
# 將產生的 `all.sql` 匯入到你的資料庫
```

## 負責項目

B09902102 陳冠辰

- 個人資訊頁
- Heatmap
- 卡牌戰場後端
- CI: formatting and linting

B10901172 黃紹祈

- 任務頁面
- 遊戲數值設定
- api串接
- vercel cron job
- testing
- deployment

B10702009 楊艾潔

- 遊戲前期構想及頁面設計
- 遊戲初始設定
- 商店頁面
- 卡牌戰場前端
- css調整與美化
