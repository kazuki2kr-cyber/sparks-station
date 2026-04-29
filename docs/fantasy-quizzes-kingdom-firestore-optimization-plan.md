# Fantasy Quizzes Kingdom: Firestore Real-time Battle Optimization Plan

## 目的

Fantasy Quizzes Kingdom の複数人リアルタイム対戦で、Firestore の読み込み・書き込み回数と更新ドキュメントサイズを減らし、50人規模でも安定して動く構成にする。

## 現状の読み書きパターン

主な対象画面:

- `src/app/FantasyQuizzesKingdom/host/[roomId]/page.tsx`
- `src/app/FantasyQuizzesKingdom/host/[roomId]/play/page.tsx`
- `src/app/FantasyQuizzesKingdom/room/[roomId]/page.tsx`
- `src/app/FantasyQuizzesKingdom/room/[roomId]/play/page.tsx`
- `src/app/FantasyQuizzesKingdom/host/[roomId]/results/page.tsx`
- `src/app/FantasyQuizzesKingdom/room/[roomId]/results/page.tsx`

現在の Firestore 構造はおおむね次の形。

```text
rooms/{roomId}
  status
  currentQuestionIndex
  currentPhase
  startTime
  hostId
  ...

rooms/{roomId}/players/{uid}
  name
  iconUrl
  score
  totalTime
  answers.{questionId}

rooms/{roomId}/questions/{questionId}
  text
  choices
  correctAnswer
  timeLimit
  points
  createdAt
```

現在の負荷要因:

1. ホストのプレイ画面が `players` サブコレクション全体を `onSnapshot` している。
2. 各プレイヤーの回答時に `players/{uid}` を更新し、`score`、`totalTime`、`answers.{questionId}` を同じドキュメントへ追記している。
3. ホスト側は全プレイヤーの `answers` を含む `players` 更新を毎回答ごとに受け取り、回答済み数とランキングを再計算している。
4. ゲストのプレイ画面は `rooms/{roomId}` と自分の `players/{uid}` を購読し、質問一覧は開始時に一括取得している。
5. 結果画面でも `players` 全体を `onSnapshot` しているため、結果確定後もリアルタイム購読が残る。
6. 標準問題の選択時に `questions` グローバルコレクションを全件取得してからクライアント側でカテゴリ絞り込みしている。
7. ルーム内に問題をサブコレクションとしてコピーしており、10問なら作成時に10 write、差し替え時は削除+再作成が発生する。

## 規模別の概算

例: 50人、10問、ホスト1人。

回答そのものの書き込み:

- 1問あたり最大50 write
- 10問で最大500 write

ホスト側の読み込み:

- `players` コレクション購読中、各回答で更新された player doc を読む
- 10問で最大500 read
- ただし player doc に `answers` が蓄積されるため、後半ほどドキュメントサイズが大きくなる

ゲスト側:

- 各ゲストは `rooms/{roomId}` のフェーズ変更を購読
- 自分の `players/{uid}` を購読
- 質問10件を開始時に一括 read

最も効いているのは「回答履歴を player doc に蓄積し、それをホストが全員分購読する」点。Firestore の請求はドキュメント単位だが、ネットワーク転送量とクライアント再描画負荷も同時に増える。

## 改修方針

Firestore は「全員が同じ小さな状態を見る」用途に絞り、回答イベントや集計は小さい単位へ分離する。

優先度は次の順。

1. すぐ効く: 購読範囲と取得方法を減らす。
2. 中期: 回答データを player doc から分離する。
3. 本命: 集計結果を専用ドキュメントへ集約し、ホストが全回答詳細を購読しない。
4. さらに強くする: Realtime Database か Cloud Functions へ移す。

## Phase 1: 小改修で読み込みを削減

### 1. 結果画面の `players` 購読を `getDocs` に変更

対象:

- `host/[roomId]/results/page.tsx`
- `room/[roomId]/results/page.tsx`

結果画面は基本的にスコア確定後の表示なので、`onSnapshot(playersRef)` ではなく `getDocs(playersRef)` で十分。再戦やリセットはルーム状態を見ればよい。

期待効果:

- 結果画面滞在中の継続 read を削減。
- 結果表示後に誰かの状態更新が入っても不要な再描画が起きない。

### 2. 参加者一覧は待機中だけ購読する

対象:

- `host/[roomId]/page.tsx`

待機室では `players` 購読が必要だが、プレイ開始後は `host/[roomId]/play` に遷移する。待機室の購読は `roomStatus === "waiting"` の期間だけに限定できる。

期待効果:

- 画面遷移の競合や不要購読を減らす。

### 3. グローバル問題取得をカテゴリクエリへ変更

対象:

- `host/[roomId]/page.tsx`

現在は `collection(db, "questions")` を全件取得してから `category` で絞っている。Firestore クエリへ変更する。

```ts
const q = categoryId === "all"
  ? query(collection(db, "questions"), limit(50))
  : query(collection(db, "questions"), where("category", "==", categoryId), limit(50));
```

期待効果:

- 問題数が増えてもルーム作成時の read が膨らまない。
- カテゴリ選択の待ち時間が減る。

### 4. ルームID衝突チェックを省略またはサーバー側へ移す

対象:

- `HomeClient.tsx`
- `themes/[slug]/client-page.tsx`

6桁IDの衝突チェックで `getDoc` を行っている。衝突確率が許容できるなら `setDoc` 前の読み込みをやめる。厳密にやるなら Cloud Function でトランザクション作成にする。

期待効果:

- ルーム作成時の read を通常1回削減。

## Phase 2: 回答データを player doc から分離

現在:

```text
players/{uid}
  score
  totalTime
  answers.{questionId}
```

提案:

```text
rooms/{roomId}/players/{uid}
  name
  iconUrl
  score
  totalTime
  joinedAt
  isHost

rooms/{roomId}/answers/{questionId}_{uid}
  uid
  questionId
  selectedOption
  isCorrect
  timeTaken
  points
  answeredAt
```

または問題単位で分ける。

```text
rooms/{roomId}/questions/{questionId}/answers/{uid}
  selectedOption
  isCorrect
  timeTaken
  points
  answeredAt
```

推奨は `rooms/{roomId}/answers/{questionId}_{uid}`。collectionGroup や単一コレクション集計がしやすく、ホストが「現在の問題の回答だけ」を購読しやすい。

回答時の書き込み:

```text
answers/{questionId}_{uid} を set
players/{uid} の score / totalTime を increment
```

クライアントから直接書くなら 2 write。Cloud Function 集計にするならクライアントは回答1 writeのみ。

期待効果:

- player doc が問題数に応じて巨大化しない。
- ホストは現在問題の回答だけを読む。
- 結果画面で必要なときだけ詳細回答を読む。

## Phase 3: 回答済み数とランキングを集約ドキュメントへ移す

ホストのプレイ画面で全 `players` を購読している理由は主に2つ。

- 回答済み数を出す。
- 現在ランキングを出す。

これを専用の小さいドキュメントに分ける。

```text
rooms/{roomId}/public/state
  currentQuestionIndex
  currentPhase
  startTime
  answeredCount
  playerCount
  topPlayers: [
    { uid, name, iconUrl, score }
  ]
  updatedAt
```

もしくは `rooms/{roomId}` 自体に `answeredCount` と `topPlayers` を持たせる。

クライアント購読:

- ホスト: `rooms/{roomId}` または `public/state` 1 doc
- ゲスト: `rooms/{roomId}` 1 doc + 自分の player 1 doc
- 結果画面: 確定後に `players` を1回取得

集計方法:

1. 最小構成: 回答時にクライアントが `answers` と `players` を書く。ホストは現在問題の `answers` だけ購読し、ランキングは `players` を `limit(10)` で取得する。
2. 推奨構成: Cloud Functions の `onWrite(answers)` で `players` と `public/state` を更新する。
3. 高頻度構成: Realtime Database で presence / answeredCount / currentState を扱い、Firestore は永続結果だけにする。

推奨は 2。クライアント改ざん対策も同時に進められる。

## Phase 4: 質問データのコピーを減らす

現在はルームごとに問題10件を `rooms/{roomId}/questions` へコピーしている。これは編集可能なオリジナル問題には向いているが、標準問題モードではコピー量が無駄になりやすい。

標準問題モード:

```text
rooms/{roomId}
  questionRefs: ["questions/xxx", "questions/yyy", ...]
  questionOrder: [...]
  answerKeyHash or answerKeyHidden
```

ただし、クライアントに正解を先に渡すと不正解防止が弱くなる。現状もクライアントに `correctAnswer` を渡しているため同等だが、厳密にするなら Cloud Function で採点する。

現実的な折衷案:

- Phase 1ではコピー継続。
- Phase 2以降で `rooms/{roomId}/questionSet/{index}` のような小さめの固定ドキュメントへする。
- 標準問題は `where("category", "==", categoryId)` + `limit` で取得し、必要な10問だけコピー。

## 推奨アーキテクチャ

### Firestore only 版

```text
rooms/{roomId}
  status
  currentQuestionIndex
  currentPhase
  startTime
  playerCount
  answeredCount
  topPlayers

rooms/{roomId}/players/{uid}
  name
  iconUrl
  score
  totalTime
  joinedAt

rooms/{roomId}/answers/{questionId}_{uid}
  uid
  questionId
  selectedOption
  isCorrect
  timeTaken
  points
  answeredAt

rooms/{roomId}/questions/{questionId}
  text
  choices
  correctAnswer
  timeLimit
  points
  order
```

読み込み:

- 待機室ホスト: `rooms/{roomId}` + `players` 購読
- 待機室ゲスト: `rooms/{roomId}` + 自分の player 1回取得
- プレイ中ホスト: `rooms/{roomId}` + 現在問題の `answers` query + 必要なら `players orderBy(score) limit(10)`
- プレイ中ゲスト: `rooms/{roomId}` + 自分の `players/{uid}`
- 結果: `players` と必要な `answers` を1回取得

### Cloud Functions 併用版

```text
client answer write
  -> rooms/{roomId}/answers/{questionId}_{uid}

function onAnswerCreate
  -> 採点
  -> players/{uid} 更新
  -> rooms/{roomId}.answeredCount 更新
  -> rooms/{roomId}.topPlayers 更新
```

利点:

- クライアントに採点ロジックを持たせなくてよい。
- `score` 改ざんを防げる。
- ホストは `rooms/{roomId}` の小さい更新だけ見ればよい。

注意点:

- 回答直後のフィードバックに Cloud Functions の遅延が乗る。
- 即時演出はローカル判定、正式スコアはサーバー判定、という二段構えにすると体感がよい。

## Firestore Rules の見直し

現在は `rooms/{roomId}` の update と、`players` / `questions` の write が `request.auth != null` なら広く許可されている。

最適化と同時に権限も絞る。

方針:

- `rooms/{roomId}` のフェーズ更新は `hostId == request.auth.uid` のみ。
- `players/{uid}` の作成・更新は本人のみ。ただしスコア更新を Cloud Functions に寄せるならクライアント更新不可。
- `answers/{answerId}` は本人の回答のみ作成可。同じ `questionId` への二重回答を禁止。
- `questions` サブコレクションの編集はホストのみ。

例:

```text
rooms/{roomId}
  update: host only

rooms/{roomId}/players/{uid}
  create: request.auth.uid == uid
  update: request.auth.uid == uid and score fields are unchanged

rooms/{roomId}/answers/{answerId}
  create: request.auth.uid == request.resource.data.uid
```

## 実装順序

### Step 1: 低リスク削減

- 結果画面の `onSnapshot(players)` を `getDocs(players)` に変更。
- 標準問題取得をカテゴリクエリに変更。
- `limit` を入れて全件取得を避ける。
- ルーム削除時にサブコレクションが残る問題も合わせて整理する。

### Step 2: answers コレクション追加

- 回答時に `rooms/{roomId}/answers/{questionId}_{uid}` へ保存。
- `players/{uid}.answers` への追記を停止。
- 結果画面のプレイ記録は `answers` から取得する。
- 既存の `players.score` / `totalTime` は当面維持する。

### Step 3: ホスト画面の購読縮小

- ホストのプレイ画面で `players` 全体購読をやめる。
- 回答済み数は `answers` の現在問題分だけ購読、または集約値を購読。
- ランキングは `query(players, orderBy("score", "desc"), limit(10))` にする。

### Step 4: Cloud Functions 集計

- 回答作成をトリガーに採点・スコア更新。
- `answeredCount` と `topPlayers` を更新。
- クライアントの `score` 更新権限を削る。

### Step 5: Realtime Database 検討

50人以上、早押し感、presence、接続状態、秒単位の状態同期をさらに強めたい場合のみ検討する。

Firestore に残す:

- ルーム定義
- 問題
- 最終結果
- 履歴

Realtime Database に移す:

- currentPhase
- startTime
- answeredCount
- presence
- liveRanking

## 期待される効果

Phase 1:

- すぐ実装でき、結果画面・問題選択の無駄な read を削減。

Phase 2:

- player doc の肥大化を止める。
- 回答詳細とプレイヤー概要を分離できる。

Phase 3:

- ホストの購読負荷を大きく削減。
- 参加人数が増えても、ホストが毎回全員分の肥大化した player doc を受け取らなくなる。

Cloud Functions 併用後:

- クライアント書き込みを回答1件に寄せられる。
- スコア改ざん耐性が上がる。
- 画面側は小さい集約ドキュメントを見るだけになる。

## 最初に実装するなら

最初のPRでは次の範囲がよい。

1. `room/[roomId]/results/page.tsx` と `host/[roomId]/results/page.tsx` の `players` 購読を単発取得へ変更。
2. `host/[roomId]/page.tsx` のグローバル問題取得をカテゴリクエリへ変更。
3. `players` doc に回答履歴を持たせ続ける現状のまま、`answers` コレクション移行の型とヘルパーを追加する。

これなら挙動変更が小さく、Firestore コスト削減の入口として安全に進められる。

## 実装メモ

2026-04-29 の初期実装では、コスト削減を優先してハイブリッド方式へ移行した。

- Firestore はルームの永続メタデータ、問題、管理画面データを維持。
- Realtime Database に `liveRooms/{roomId}` を追加。
- 対戦中の `state`、`players`、`answers` は Realtime Database を使用。
- プレイ中の回答は Firestore `players/{uid}` ではなく RTDB `answers/{questionId}/{uid}` と RTDB player score へ書き込む。
- 結果画面は RTDB の players / answers を単発取得する。
- RTDB rules は `database.rules.json` で管理する。

注意:

- `NEXT_PUBLIC_FIREBASE_DATABASE_URL` が設定されていない場合は `https://hayaoshi-aef9c-default-rtdb.firebaseio.com` を使う。Firebase 側で別リージョンの RTDB インスタンスを作った場合は環境変数で上書きする。
