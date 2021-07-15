import React from 'react'
import styles from './recipe-edit.module.css'

type Props = {
  ingredient: any
}

export default function RecipeIngredientEdit({ ingredient }: Props) {
  return (
    <>
      <input
        className={styles.input}
        type="text"
        value={ingredient.name}
      />
      <input
        className={styles.input}
        type="text"
        value={ingredient.amount}
      />
      <button className="btn btn--danger">&times;</button>
    </>
  )
}
