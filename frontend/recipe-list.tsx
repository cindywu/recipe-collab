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
  const { handleRecipeAdd } = useContext(RecipeContext)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(null)

  const recipes = useSubscribe(
    rep,
    async tx => {
      const list = await tx.scan({prefix: 'recipe/'}).entries().toArray()
      // list.sort(([, {order: a}], [, {order: b}]) => a - b)
      return list
    },
    [],
  )
  const selectedRecipe = recipes.find(recipe => recipe[1].id === selectedRecipeId)
  console.log('selectedRecipe', selectedRecipe)
  console.log('recipes', recipes)

  function handleRecipeSelect(id: any) {
    setSelectedRecipeId(id)
  }


  function onRecipeAdd() {
    const last = recipes.length && recipes[recipes.length - 1][1]
    const order = (last?.order ?? 0) + 1
    handleRecipeAdd(order)
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
      {selectedRecipe && <RecipeEdit recipe={selectedRecipe[1]} />}
    </div>
  )
}
