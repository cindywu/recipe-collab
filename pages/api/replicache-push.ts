import { db } from '../../backend/db'
import Pusher from 'pusher'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: any, res: any) => {
  const push = req.body
  console.log('Processing push', JSON.stringify(push))

  const t0 = Date.now()
  try {
    await db.tx(async t => {
      const {nextval: version} = await t.one("SELECT nextval('version')")
      let lastMutationID = await getLastMutationID(t, push.clientID)

      console.log('version', version, 'lastMutationID', lastMutationID)

      for (const mutation of push.mutations) {
        const t1 = Date.now()

        const expectedMutationID = lastMutationID + 1

        if (mutation.id < expectedMutationID) {
          console.log(
            `Mutation ${mutation.id} has already been processed - skipping`,
          )
          continue
        }
        if (mutation.id > expectedMutationID) {
          console.warn(`Mutation ${mutation.id} is from the future - aborting`)
          break
        }

        console.log('Processing mutation:', JSON.stringify(mutation))

        switch (mutation.name) {
          case 'createRecipe':
            await createRecipe(t, mutation.args, version);
            break
          case 'deleteRecipe':
            await deleteRecipe(t, mutation.args)
            break
          case 'updateRecipe':
            await updateRecipe(t, mutation.args, version);
            break
          default:
            throw new Error(`Unknown mutation: ${mutation.name}`)
        }

        lastMutationID = expectedMutationID;
        console.log('Processed mutation in', Date.now() - t1);
      }

      await sendPoke()

      console.log(
        'setting',
        push.clientID,
        'last_mutation_id to',
        lastMutationID,
      );
      await t.none(
        'UPDATE recipe_replicache_client SET last_mutation_id = $2 WHERE id = $1',
        [push.clientID, lastMutationID],
      );
      res.send('{}');
    });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.toString());
  } finally {
    console.log('Processed push in', Date.now() - t0);
  }
}

async function getLastMutationID(t: any, clientID: any) {
  const clientRow = await t.oneOrNone(
    'SELECT last_mutation_id FROM recipe_replicache_client WHERE id = $1', clientID,
  );
  if (clientRow) {
    return parseInt(clientRow.last_mutation_id)
  }

  console.log('Creating new client', clientID)
  await t.none(
    'INSERT INTO recipe_replicache_client (id, last_mutation_id) VALUES ($1, 0)',
    clientID,
  );
  return 0
}

async function createRecipe(t: any, {id, name, servings, cooktime, instructions, ingredients, order}: any, version: any) {
  await t.none(
    `INSERT INTO recipe (
    id, name, servings, cooktime, instructions, ingredients, ord, version) values
    ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, name, servings, cooktime, instructions, ingredients, order, version],
  )
}

async function deleteRecipe(t: any, { id }: any) {
  await t.none(
    'DELETE FROM recipe WHERE id = ($1)',
    [id],
  )
}

async function updateRecipe(t: any, {id, name, servings, cooktime, instructions, ingredients, order}: any, version: any) {
  console.log('>>>>>>>>>> cooktime', cooktime)
  await t.none(
    `UPDATE recipe
    SET
    name = ($2),
    servings = ($3),
    cooktime = ($4),
    instructions = ($5),
    ingredients = ($6),
    ord = ($7),
    version = ($8)
    WHERE id = ($1)`,
    [id, name, servings, cooktime, instructions, ingredients, order, version],
  )
}

async function sendPoke() {
  const pusher = new Pusher({
    appId: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY!,
    secret: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER!,
    useTLS: true,
  });
  const t0 = Date.now();
  await pusher.trigger('default', 'poke', {});
  console.log('Sent poke in', Date.now() - t0);
}



