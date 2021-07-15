import React from 'react'
import styles from './recipe-edit.module.css'

export default function RecipeIngredientEdit() {
  return (
    <>
      <input className={styles.input} type="text"/>
      <input className={styles.input} type="text"/>
      <button className="btn btn--danger">&times;</button>
    </>
  )
}
