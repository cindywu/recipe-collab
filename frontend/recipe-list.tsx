import React from 'react'
import Recipe from './recipe'
import { useSubscribe } from 'replicache-react'
import styles from './recipe-list.module.css'

type Props = {
  rep: any
  handleRecipeAdd: (order: any) => void
}

export default function RecipeList({ rep, handleRecipeAdd } : Props) {
  const recipes = useSubscribe(
    rep,
    async tx => {
      const list = await tx.scan({prefix: 'recipe/'}).entries().toArray()
      // list.sort(([, {order: a}], [, {order: b}]) => a - b)
      return list
    },
    [],
  )

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
    </div>
  )
}
