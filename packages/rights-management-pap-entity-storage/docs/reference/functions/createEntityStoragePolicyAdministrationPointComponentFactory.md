# Function: createEntityStoragePolicyAdministrationPointComponentFactory()

> **createEntityStoragePolicyAdministrationPointComponentFactory**(`entityStorage`, `maxQueryResults?`): () => [`PolicyAdministrationPointComponentEntityStorage`](../classes/PolicyAdministrationPointComponentEntityStorage.md)

Create a factory function for the entity storage policy administration point component.

## Parameters

### entityStorage

`IEntityStorageComponent`\<[`OdrlPolicy`](../classes/OdrlPolicy.md)\>

The entity storage component to use.

### maxQueryResults?

`number`

The maximum number of query results to return.

## Returns

A function that creates a new entity storage policy administration point component.

> (): [`PolicyAdministrationPointComponentEntityStorage`](../classes/PolicyAdministrationPointComponentEntityStorage.md)

### Returns

[`PolicyAdministrationPointComponentEntityStorage`](../classes/PolicyAdministrationPointComponentEntityStorage.md)
