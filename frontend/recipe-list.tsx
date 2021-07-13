import React from 'react'
import Recipe from './recipe'
import { useSubscribe } from 'replicache-react'

type Props = {
  rep: any
}

export default function RecipeList({ rep } : Props) {
  const recipes = useSubscribe(
    rep,
    async tx => {
      const list = await tx.scan({prefix: 'recipe/'}).entries().toArray()
      // list.sort(([, {order: a}], [, {order: b}]) => a - b)
      return list
    },
    [],
  )

  return (
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
  )
}
