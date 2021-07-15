import { db } from '../../backend/db.js'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (_: any, res: any) => {
  await db.task(async t => {
    await t.none('DROP TABLE IF EXISTS recipe')
    await t.none('DROP TABLE IF EXISTS recipe_replicache_client')
    await t.none('DROP SEQUENCE IF EXISTS version')
    // Stores recipe data
    await t.none(`CREATE TABLE recipe (
      id VARCHAR(255) PRIMARY KEY NOT NULL,
      name VARCHAR(255) NOT NULL,
      servings BIGINT NOT NULL,
      cooktime TEXT NOT NULL,
      instructions TEXT NOT NULL,
      ingredients TEXT ARRAY NOT NULL,
      ord BIGINT NOT NULL,
      version BIGINT NOT NULL)`)
    // Stores last mutation ID for each client
    await t.none(`CREATE TABLE recipe_replicache_client (
      id VARCHAR(255) PRIMARY KEY NOT NULL,
      last_mutation_id BIGINT NOT NULL)`)
    // Will be used for computing diffs for pull response
    await t.none('CREATE SEQUENCE version')
  })
  res.send('ok')
}

