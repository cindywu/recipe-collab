import React, { useEffect, useState } from 'react'
import RecipeList from '../frontend/recipe-list'
import RecipeEdit from '../frontend/recipe-edit'
import { Replicache } from 'replicache'
import { v4 as uuidv4 } from 'uuid'
import { useSubscribe } from 'replicache-react'
import Pusher from 'pusher-js'

type RecipesContextType = {
  handleRecipeAdd: (order: any) => void,
  handleRecipeDelete: (id: string) => void
  handleRecipeChange: (id: string, recipe: any) => void
}

const defaultContextValue= {
  handleRecipeAdd: (order: any) => {},
  handleRecipeDelete: (id: string) => {},
  handleRecipeChange: (id: string, recipe: any) => {}
}

export const RecipeContext = React.createContext<RecipesContextType>(defaultContextValue)

export default function Home() {
  const [rep, setRep] = useState<any>(null)

  const recipeContextValue = {
    handleRecipeAdd,
    handleRecipeDelete,
    handleRecipeChange
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
            cooktime,
            instructions,
            ingredients,
            order,
          }) {
            await tx.put (`recipe/${id}`, {
              id,
              name,
              servings,
              cooktime,
              instructions,
              ingredients,
              order,
            })
          },
          async deleteRecipe(tx, { id }) {
            await tx.del(`recipe/${id}`)
          },
          async updateRecipe(tx, {
            id,
            name,
            servings,
            cooktime,
            instructions,
            ingredients,
            order,
          }) {
            await tx.put(`recipe/${id}`, {
              id,
              name,
              servings,
              cooktime,
              instructions,
              ingredients,
              order,
            })
          },
        }
      })
      listen(rep)
      setRep(rep)
    })()
  }, [])

  function handleRecipeAdd(order: any,) {
    rep.mutate.createRecipe({
      id: uuidv4(),
      name: 'New',
      servings: 1,
      cooktime: '1:00',
      instructions: 'Instr.',
      ingredients: [
        { id: uuidv4(), name: 'Name', amount: '1 Tablespoon' }
      ],
      order,
    })
  }

  function handleRecipeChange(order: any, recipe: any) {
    console.log('recipe hi', recipe, 'order', order)

    console.log('cooktime', recipe.cooktime)
    console.log('cookTime', recipe.cookTime)
    rep.mutate.updateRecipe({
      id: recipe.id,
      name: recipe.name,
      servings: recipe.servings,
      cooktime: recipe.cooktime,
      instructions: recipe.instructions,
      ingredients: recipe.ingredients,
      order: order,
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

    </RecipeContext.Provider>
  )
}

function listen(rep: any) {
  console.log('listening');
  // Listen for pokes, and pull whenever we get one.
  Pusher.logToConsole = true;
  const pusher = new Pusher(process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
  });
  const channel = pusher.subscribe('default');
  channel.bind('poke', () => {
    console.log('got poked');
    rep.pull();
  });
}
