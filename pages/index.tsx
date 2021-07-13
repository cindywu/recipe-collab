import React, { useEffect, useState } from 'react'
import RecipeList from '../frontend/recipe-list'
import { Replicache } from 'replicache'
import { v4 as uuidv4 } from 'uuid'

export default function Home() {
  const [rep, setRep] = useState<any>(null)

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

  return rep && <RecipeList rep={rep} handleRecipeAdd={handleRecipeAdd} handleRecipeDelete={handleRecipeDelete}/>
}

function listen(rep: any) {
  console.log('rep', rep)
}
