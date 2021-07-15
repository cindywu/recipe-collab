  import React from 'react'
  import styles from './recipe-edit.module.css'
  import RecipeIngredientEdit from './recipe-ingredient-edit'

  type Props = {
    recipe: any
    onRecipeChange: (recipe: any) => void
  }

  export default function RecipeEdit({ recipe, onRecipeChange }: Props) {
    console.log('recipe', recipe)

    function handleChange(changes: any) {
      onRecipeChange({ ...recipe, ...changes })
    }

    return (
      <div className={styles.container}>
        <div className={styles.removeBtnContainer}>
          <button className="btn btn--remove">&times;</button>
        </div>

        <div className={styles.detailsGrid}>
          <label
            htmlFor="name"
            className={styles.label}>
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={recipe.name}
            className={styles.input}
            onInput={ e => handleChange({ name: e.target.value })}
          />
          <label
            htmlFor="cookTime"
            className={styles.label}
          >
            Cook Time
          </label>
          <input
            type="text"
            name="cookTime"
            id="cookTime"
            value={recipe.cookTime}
            className={styles.input}
          />
          <label
            htmlFor="servings"
            className={styles.label}
          >
            Servings
          </label>
          <input
            type="number"
            min="1"
            name="servings"
            id="servings"
            value={recipe.servings}
            className={styles.input}
          />
          <label
            htmlFor="instructions"
            className={styles.label}
          >
            Instructions
          </label>
          <textarea
            name="instructions"
            id="instructions"
            className={styles.input}
          >
            {recipe.instructions}
          </textarea>
        </div>
        <br />
        <label className={styles.label}>Ingredients</label>
        <div className={styles.ingredientGrid}>
          <div>Name</div>
          <div>Amount</div>
          <div></div>

          {recipe.ingredients.map((ingredient: any) => (
            <RecipeIngredientEdit
              key={ingredient.id}
              ingredient={ingredient}
            />

          ))}
        </div>
        <div className={styles.addIngredientBtnContainer}>
          <button className="btn btn--primary">Add Ingredient</button>
        </div>
      </div>
    )
  }
