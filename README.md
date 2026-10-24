# Kurumi motion study

HTML + Chrome + ffmpeg で作る、UI モーション動画の練習用プロジェクト。
題材は架空のパン卸向けサービス「Kurumi」（実在しない。数値もデモ用）。

A practice project for UI motion graphics, built with HTML, headless Chrome and ffmpeg.
The subject is "Kurumi", a fictional order-entry service for bakery wholesalers (not a real product; all figures are demo values).

## 何をするか / What this is

- **v1**（20秒）: 注文カードが表に吸い込まれる1アイデアだけの動画。
- **v2**（45秒）: 物語型。夜中に注文が届く → 手で入力し直す → 「何個入りのトレイ？」の曖昧さ → 自動入力 → 6.5 hrs。モーションブラー（120fps で描いて4枚平均）、紙の質感、傾き＋ぼけ＋ease-out で入るカードの動きを入れた。
- 参考にした動画は、技法（カットの長さ、字幕のタイミング、カードの入り方、色）を分析しただけ。映像・台本・人物は複製していない。素材はすべて自作。

Reference: https://lnkd.in/p/ge3WCY8S (analysed for technique only; no footage, script or people are reused).

## 動画 / Videos

- `v1/kurumi-demo.mp4` — 1920×1080, 30fps, 20s
- `v2/kurumi-v2.mp4` — 1920×1080, 30fps, 45s

## 作り直す / Rebuild

```bash
npm install                      # puppeteer-core。Google Chrome が必要（macOS のパスを render.mjs に直書き）
cd v2
node render.mjs /tmp/v2frames    # 5400 枚のサブフレームを書き出す
node build.mjs  /tmp/v2frames kurumi-v2.mp4   # 4枚平均 + 音の合成 + MP4
```

`node snap.mjs <outDir> 3 5.5 ...` で、指定した秒数の静止画だけ撮れる。
v1 は `node render.mjs <dir>` のあと `bash encode.sh <dir> kurumi-demo.mp4`。

## 最新状況 / Status (2026-10-24)

- 動画 v1・v2: 完成、このリポジトリに入っている。
- Figma 版（Motion β で再生できる編集可能レイヤー版）: Figma ファイル「Kurumi v2 – Motion study」に、メインフレーム（9シーン、約45秒、キーフレーム付き）を作成済み。
  https://www.figma.com/design/wpYr9vpQh4gNx2O63Rb5Kf （個人の My space・非公開）
  - 未完了: 説明用フレーム（LinkedIn URL、簡潔な説明文、Fira Code の引用ブロック）。Figma MCP の呼び出し上限（Starter プラン）に達して中断。
  - 未検証: Figma 上での再生確認（export_video でフレームを見る）。Figma の画面でシーンごとの動きを確かめてから、必要なら調整する。
  - Figma 版は 3D 遠近のカード束（v2 の S2）を、平面の重なり＋位置の移動で近似している。音声は含まれない。
- 次にやること: 上限が戻ったら説明用フレームを足して、Motion で再生確認する。

### Figma に書く予定だった引用ブロック（Fira Code）

> 場所
> - 動画: output/video-study/kurumi/v2/kurumi-v2.mp4（worktree .claude/worktrees/video-motion-study）
> - ソース: 同じ v2/ の scene.html、render.mjs、build.mjs
> - ブランチ: worktree-video-motion-study（コミット 31e53ff、push 済み。PR は未作成です）
> - 作り直すとき: node render.mjs <フォルダ> を実行し、続けて node build.mjs <フォルダ> kurumi-v2.mp4 を実行します。

（元は ai-ops リポジトリの `output/video-study/kurumi/` にあった。このリポジトリが正本になった。）

## ライセンス / License

未設定（All rights reserved）。使いたい場合は連絡してほしい。
No license is set (all rights reserved).
