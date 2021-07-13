import React, { useEffect, useState } from 'react'
import RecipeList from '../frontend/recipe-list'
import { Replicache } from 'replicache'

export default function Home() {
  const [rep, setRep] = useState<any>(null)

  useEffect(() => {
    (async () => {
      const rep = new Replicache({
        pushURL: '/api/replicache-push',
        pullURL: '/api/replicache-pull',
        wasmModule: './replicache.dev.wasm',
      })
      listen(rep)
      setRep(rep)
    })()
  }, [])

  return rep && <RecipeList rep={rep} />
}

function listen(rep: any) {
  console.log('rep', rep)
}
