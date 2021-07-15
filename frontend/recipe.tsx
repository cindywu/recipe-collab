import React, { useContext } from 'react'
import IngredientList from './ingredient-list'
import styles from './recipe.module.css'
import { RecipeContext } from '../pages/index'

type Props = {
  recipe: any
  handleRecipeSelect: (id: any) => void
}

export default function Recipe({ recipe, handleRecipeSelect }: Props) {
  const { handleRecipeDelete } = useContext(RecipeContext)

  function onDeleteClick() {
    handleRecipeDelete(recipe.id)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3  className={styles.title}>{recipe.name}</h3>
        <div>
          <button
            className="btn btn--primary mr-1"
            onClick={() => handleRecipeSelect(recipe.id)}
          >Edit</button>
          <button className="btn btn--danger" onClick={onDeleteClick}>Delete</button>
        </div>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Cook Time:</span>
        <span className={styles.value}>{recipe.cookTime}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Servings:</span>
        <span className={styles.value}>{recipe.servings}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Instructions</span>
        <div className={`${styles.value} ${styles.instructions} ${styles.indented}`}>
          {recipe.instructions}
        </div>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Ingredients</span>
        <div className={`${styles.value} ${styles.indented}`}>
          <IngredientList ingredients={recipe.ingredients} />
        </div>
      </div>
    </div>
  )
}
