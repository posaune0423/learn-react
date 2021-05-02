import React, { createContext, useContext } from 'react'
import { Button } from '@material-ui/core'

// コンテクストを使用すると、全てのコンポーネントを明示的に通すことなしに
// コンポーネントツリーの深くまで値を渡すことができます。
// 現在のテーマ（デフォルトは "light"）の為のコンテクストを作成します。

const ButtonColorContext = createContext("secondary")

const App = () => {
  return (
    <ButtonColorContext.Provider value="primary">
      <Toolbar color="primary" />
    </ButtonColorContext.Provider>
  )
}

function Toolbar() {
  // Toolbar コンポーネントは外部から "theme" プロパティを受け取り、
  // プロパティを ThemedButton へ渡します。
  // アプリ内の各ボタンがテーマを知る必要がある場合、
  // プロパティは全てのコンポーネントを通して渡される為、面倒になります。
  return (
    <div>
      <ThemedButton />
    </div>
  )
}

function ThemedButton() {
  const ButtonColor = useContext(ButtonColorContext)
  console.log(ButtonColor)
  return (
    <Button color={ButtonColor} variant="contained">
      Test Button
    </Button>
  )
}

export default App
