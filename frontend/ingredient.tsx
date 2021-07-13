import React from 'react'

type Props = {
  name: string,
  amount: string,
}

export default function Ingredient({ name, amount } : Props) {
  return (
    <>
      <span>{name}</span>
      <span>{amount}</span>
    </>
  )
}
