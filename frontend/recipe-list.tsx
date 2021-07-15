import React, { useContext, useState } from 'react'
import Recipe from './recipe'
import { useSubscribe } from 'replicache-react'
import styles from './recipe-list.module.css'
import { RecipeContext } from '../pages/index'
import RecipeEdit from './recipe-edit'

type Props = {
  rep: any
}

export default function RecipeList({ rep } : Props) {
  const { handleRecipeAdd, handleRecipeChange } = useContext(RecipeContext)
  const [selectedRecipeId, setSelectedRecipeId] = useState<any>(null)

  const recipes = useSubscribe(
    rep,
    async tx => {
      const list = await tx.scan({prefix: 'recipe/'}).entries().toArray()
      // list.sort(([, {order: a}], [, {order: b}]) => a - b)
      return list
    },
    [],
  )
  const selectedRecipe = recipes.find((recipe: any) => recipe[1].id === selectedRecipeId)

  function handleRecipeSelect(id: any) {
    setSelectedRecipeId(id)
  }

  function onRecipeAdd() {
    const maxOrder = recipes.length === 0 ? 0 : recipes.map((r: any) => r[1].order).reduce((a, b) => a > b ? a : b)
    const order = maxOrder + 1
    handleRecipeAdd(order)
  }

  function onRecipeChange(recipe: any){
    const maxOrder = recipes.length === 0 ? 0 : recipes.map((r: any) => r[1].order).reduce((a, b) => a > b ? a : b)
    const order = maxOrder + 1
    handleRecipeChange(order, recipe)
  }

  return (
    <div className={styles.container}>
      <div>
        {recipes.map(([k, v]) => {
          return (
            <Recipe
              key={k}
              recipe={v}
              handleRecipeSelect={handleRecipeSelect}
            />
          )
        })}
      </div>
      <div className={styles.addRecipeBtnContainer}>
        <button
          className="btn btn--primary"
          onClick={onRecipeAdd}
        >
          Add Recipe
        </button>
      </div>
      {selectedRecipe && <RecipeEdit recipe={selectedRecipe[1]} onRecipeChange={onRecipeChange}/>}
    </div>
  )
}
