import React from 'react'
import Ingredient from './ingredient'
import styles from './ingredient-list.module.css'

type Props = {
  ingredients: any,
}

export default function IngredientList({ ingredients }: Props) {
  const ingredientElements = ingredients.map((ingredient: any) => {
    return <Ingredient key={ingredient.id} {...ingredient} />
  })
  return (
    <div className={styles.grid}>
      {ingredientElements}
    </div>
  )
}
