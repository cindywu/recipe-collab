// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: any, res: any) => {
  res.json({
    lastMutationID: 0,
    cookie: null,
    patch: [
      {op: 'clear'},
      {
        op: 'put',
        key: 'recipe/ab904a19-7bdc-4cdc-af7c-d8606e02f611',
        value: {
          id: 'ab904a19-7bdc-4cdc-af7c-d8606e02f611',
          order: 1,
          name: 'Plain Chicken',
          servings: 3,
          cookTime: '1:45',
          instructions: '1. Put salt on chicken\n2. Put chicken in a bowl\n3. Add chicken stock',
          ingredients: [
            {
              id: 'f2b7d3f4-f8e5-4b6e-b8f6-e9e9f9e7e9b6',
              name: 'Chicken',
              amount: '2 Pounds',
            },
            {
              id: 'e8f9a9c5-5c8b-4f8b-8f9a-9b1c7e9b2b2a',
              name: 'Salt',
              amount: '1 Tablespoon',
            }
          ]
        }
      },
      {
        op: 'put',
        key: 'recipe/c5f9b8a1-9a5d-4d9c-9d8e-f0e2d4f8f7f9',
        value: {
          id: 'c5f9b8a1-9a5d-4d9c-9d8e-f0e2d4f8f7f9',
          order: 2,
          name: 'Plain Pork',
          servings: 5,
          cookTime: '0:45',
          instructions: '1. Put salt on pork\n2. Put pork in a bowl\n3. Eat pork',
          ingredients: [
            {
              id: 'c5f9b8a1-9a5d-4d9c-9d8e-f0e2d4f8f7f9',
              name: 'Pork',
              amount: '1 Pounds',
            },
            {
              id: 'e8f9a9c5-5c8b-4f8b-8f9a-9b1c7e9b2b2a',
              name: 'Paprika',
              amount: '2 Tablespoons',
            }
          ]
        }
      },
    ]
  })
  res.end()
}