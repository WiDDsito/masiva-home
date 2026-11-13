import { Fragment } from 'react'

export function SplitText({ text }: { text: string }) {
  return <>{text.split(' ').map((word, index) => <Fragment key={`${word}-${index}`}><span className="split-word"><span className="split-word__inner">{word}</span></span>{' '}</Fragment>)}</>
}
