# Note About Next.js

## SSG

Next.js では pages ディレクトリ内のファイル名に基づいてルーティングされます。
[Pages - Documentation | Next.js](https://nextjs.org/docs/basic-features/pages)

```jsx:pages/welcome.js
function Welcome() {
  return <div>ようこそ Next.js へ！</div>
}

export default Welcome
```

上記のファイルを生成し`/welcome`にアクセスすると以下のように表示されます。

```html:
<div id="__next">
   <div>ようこそ Next.js へ！</div>
</div>
```

この時`pages/welcome.js`の出力は**常に同じ**です。`/welcome`にアクセスすると上記の HTML が必ず表示されます。そのためアクセスの度にレンダリング（SSR）する必要がありません。

Next.js はこのようなケースでは自動的に静的なファイルをビルド時に生成(SSG)します。
これは**Automatic Static Optimization**と呼ばれます。

[next.js/automatic-static-optimization.md at v9.2.2 · zeit/next.js](https://github.com/zeit/next.js/blob/v9.2.2/docs/advanced-features/automatic-static-optimization.md)

> Next.js automatically determines that a page is static (can be prerendered) if it has no blocking data requirements. This determination is made by the absence of getInitialProps in the page.

つまり pages フォルダ内のファイルに`getInitialProps`の存在をチェックし、存在しなければ事前に生成が可能と判断します。この`getInitialProps`とはどんなメソッドなのでしょうか。

## getInitialProps

[next.js/data-fetching.md at v9.2.2 · zeit/next.js](https://github.com/zeit/next.js/blob/v9.2.2/docs/basic-features/data-fetching.md)

`getInitialProps`はページがレンダリングされる前に実行される API です。該当のパスにリクエストがあると実行され、ページに必要なデータを props として渡します。
（実際にはログを送信するなどの HTML に影響しない副作用を行うこともある。）

今回紹介する 3 つの API と同様に**pages フォルダ内のファイル**のみで使用できます。

`getInitialProps`が SSR 専用の API というのは誤解です。
通常のアクセスの場合、`getInitialProps`がサーバー側で実行されます。
一方、`next/link`を使用してクライアントサイドルーティングした場合にはクライアント側で実行されます。
そのため`isomorphic-unfetch`といったクライアント側でもサーバー側でも動作する fetch ライブラリが推奨されます。

```jsx:pages/stars.js
// クライアントサイドでもサーバーサイドでも使用するため
import fetch from 'isomorphic-unfetch'

// getInitialPropsで取得したスター数を受け取る
function Stars({ stars }) {
  return <div>Next stars: {stars}</div>
}

// 先に実行される
Stars.getInitialProps = async () => {
  const res = await fetch('https://api.github.com/repos/zeit/next.js')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default Stars
```

ここでは Next.js の GitHub スター数を取得しています。return された値は props として受け取り、div に反映させています。

生成される HTML は以下の通りです。

```html:
<div id="__next">
   <div>Next stars: 45601</div>
</div>
```

45601 という値は執筆時点のものです。
リクエストの度にレンダリングが行われるため**アクセスするたびに変化する**可能性があります。

SSR は便利ですが欠点もあります。

- サーバーを管理する必要がある
- リクエストの度に HTML を生成する
- 外部の API がダウンしていると getInitialProps が評価されないため HTML が生成できない

こうした理由から事前に静的なファイルをビルドしておくことが求められてきました。

## next export

外部に依存するデータをビルド時に取得し SSG するためには、これまで`next export`というコマンドが利用できました。`next build`と異なり`getInitialProps`が存在するページでもビルド時に評価をし、静的なファイルを生成することができます。
しかしこれには問題がありました。

`next link`を使用して`getInitialProps`を使用しているページにクライアントサイドでルーティングを行うと事前に`next export`で生成したファイルではなく再度クライアント側で`getInitialProps`が実行されてしまうのです。

これを解決するために新たな API が導入されました。

# getStaticProps

やっと本題です。
`getStaticProps`は`getInitialProps`が行っていた処理をビルド時に行い、静的なファイルを事前に生成するための API です。`next export`と異なり`next link`でルーティングした場合でも静的なファイルを利用します。
このメソッドはクライアント側で実行されることはありません。**必ず事前にサーバーサイドで実行**されます。

```jsx:pages/buildTimeStars.js
// クライアントサイドでは実行されないため'isomorphic-unfetch'は必要ない
import fetch from 'node-fetch'

// getStaticPropsで取得したスター数とビルド時の時刻を受け取る
function BuildTimeStars({ stars, build_time }) {
  return <div>ビルド時（{build_time}）のNextのstar数は: {stars}</div>
}

// ビルド時に実行される
export async function getStaticProps() {
  const res = await fetch('https://api.github.com/repos/zeit/next.js')
  const json = await res.json()
  const stars = json.stargazers_count
  // ビルド時刻の取得
  const build_time = new Date().toString();

  return {
    props: {
      stars,
      build_time
    },
  }
}

export default BuildTimeStars
```

`/stars`と同様に Next.js の GitHub スター数を表示するページです。ただし今回は`getStaticProps`を使用してビルド時の時刻も props として渡しています。

このページは外部の API に表示結果が依存していますが**アクセスの度に SSR しません**。ビルド時にデータを取得し静的なファイルを事前に生成します。

表示される HTML は以下の通りです。

```html:
<div id="__next">
   <div>ビルド時（Sat Mar 07 2020 18:44:20 GMT+0000 (Coordinated Universal Time)）のNextのstar数は: 45601</div>
</div>
```

再ビルドしない限り**いつアクセスしても同じ結果**です。時刻やスター数はあくまでビルド時のものです。

---
