# Interface: IPapQueryRequest

The request structure for querying policies.

## Properties

### query?

> `optional` **query**: `object`

The query parameters of the request.

#### cursor?

> `optional` **cursor**: `string`

The cursor for pagination.

***

### body?

> `optional` **body**: `object`

The body of the request.

#### conditions?

> `optional` **conditions**: `EntityCondition`\<`IOdrlPolicy`\>

The conditions to use in the query.
