import { storage } from '~/lib/storage'

const DATA_VERSION = 1

async function migrationFromVersion0() {
  const apiKey = await storage.getItem('apiKey')
  const url = await storage.getItem('url')

  await storage.setItem('options', {
    apiKey: apiKey ?? '',
    url: url ?? '',
  })
}

export const migrations: (() => Promise<void>)[] = [migrationFromVersion0]

// check data in storage and update if needed

export async function migrateData() {
  try {
    const version = (await storage.getItem('version')) ?? 0
    if (version === DATA_VERSION) {
      console.log('Data is already up to date')
      return
    }
    const migratedMigrations = migrations.slice(version)
    for (const migration of migratedMigrations) {
      await migration()
    }
    console.log('Data migrated successfully to version', DATA_VERSION)
    await storage.setItem('version', DATA_VERSION)
  } catch (error) {
    console.error('Error migrating data:', error)
  }
}
