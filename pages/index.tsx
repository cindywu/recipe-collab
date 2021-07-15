import React, { useEffect, useState } from 'react'
import RecipeList from '../frontend/recipe-list'
import RecipeEdit from '../frontend/recipe-edit'
import { Replicache } from 'replicache'
import { v4 as uuidv4 } from 'uuid'

type RecipesContextType = {
  handleRecipeAdd: (order: any) => void,
  handleRecipeDelete: (id: string) => void
}

const defaultContextValue= {
  handleRecipeAdd: (order: any) => {},
  handleRecipeDelete: (id: string) => {},
}

export const RecipeContext = React.createContext<RecipesContextType>(defaultContextValue)

export default function Home() {
  const [rep, setRep] = useState<any>(null)

  const recipeContextValue = {
    handleRecipeAdd,
    handleRecipeDelete,
  }

  useEffect(() => {
    (async () => {
      const rep = new Replicache({
        pushURL: '/api/replicache-push',
        pullURL: '/api/replicache-pull',
        wasmModule: './replicache.dev.wasm',
        mutators: {
          async createRecipe(tx, {
            id,
            name,
            servings,
            cookTime,
            instructions,
            ingredients,
            order,
          }) {
            await tx.put (`recipe/${id}`, {
              id,
              name,
              servings,
              cookTime,
              instructions,
              ingredients,
              order,
            })
          },
          async deleteRecipe(tx, { id }) {
            await tx.del(`recipe/${id}`)
          },
        }
      })
      listen(rep)
      setRep(rep)
    })()
  }, [])

  function handleRecipeAdd(order: any) {
    rep.mutate.createRecipe({
      id: uuidv4(),
      name: 'New',
      servings: 1,
      cookTime: '1:00',
      instructions: 'Instr.',
      ingredients: [
        { id: uuidv4(), name: 'Name', amount: '1 Tablespoon' }
      ],
      order,
    })
  }

  function handleRecipeDelete(id: string) {
    rep.mutate.deleteRecipe({
      id: id
    })
  }

  return (
    rep &&
    <RecipeContext.Provider value={recipeContextValue}>
    <RecipeList
      rep={rep}
    />
    <RecipeEdit />
    </RecipeContext.Provider>
  )
}

function listen(rep: any) {
  console.log('rep', rep)
}
