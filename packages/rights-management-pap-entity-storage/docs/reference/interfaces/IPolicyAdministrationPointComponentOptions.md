# Interface: IPolicyAdministrationPointComponentOptions

Options for the Policy Administration Point Component.

## Properties

### entityStorage

> **entityStorage**: `IEntityStorageComponent`\<[`OdrlPolicy`](../classes/OdrlPolicy.md)\>

The entity storage component for storing policies.

***

### config?

> `optional` **config**: `object`

Configuration options for the Policy Administration Point.

#### maxQueryResults?

> `optional` **maxQueryResults**: `number`

The maximum number of policies to return in a query.
Defaults to 100.
