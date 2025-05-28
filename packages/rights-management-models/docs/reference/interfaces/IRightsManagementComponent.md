# Interface: IRightsManagementComponent

Interface describing a unified Rights Management Component.
This serves as a single point of entry for all rights management operations.

## Extends

- `IComponent`

## Methods

### papStore()

> **papStore**(`policy`, `userIdentity`, `nodeIdentity`): `Promise`\<`void`\>

PAP: Store a policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to store.

##### userIdentity

The identity of the user performing the operation.

`undefined` | `string`

##### nodeIdentity

`string`

The identity of the node the operation is performed on.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### papRetrieve()

> **papRetrieve**(`policyId`, `userIdentity`, `nodeIdentity`): `Promise`\<`IOdrlPolicy`\>

PAP: Retrieve a policy.

#### Parameters

##### policyId

`string`

The id of the policy to retrieve.

##### userIdentity

The identity of the user performing the operation.

`undefined` | `string`

##### nodeIdentity

`string`

The identity of the node the operation is performed on.

#### Returns

`Promise`\<`IOdrlPolicy`\>

The policy.

***

### papRemove()

> **papRemove**(`policyId`, `userIdentity`, `nodeIdentity`): `Promise`\<`void`\>

PAP: Remove a policy.

#### Parameters

##### policyId

`string`

The id of the policy to remove.

##### userIdentity

The identity of the user performing the operation.

`undefined` | `string`

##### nodeIdentity

`string`

The identity of the node the operation is performed on.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### papQuery()

> **papQuery**(`conditions?`, `cursor?`, `pageSize?`, `userIdentity?`, `nodeIdentity?`): `Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

PAP: Query the policies using the specified conditions.

#### Parameters

##### conditions?

`EntityCondition`\<`IOdrlPolicy`\>

The conditions to use for the query.

##### cursor?

`string`

The cursor to use for pagination.

##### pageSize?

`number`

The number of results to return per page.

##### userIdentity?

`string`

The identity of the user performing the operation.

##### nodeIdentity?

`string`

The identity of the node the operation is performed on.

#### Returns

`Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Cursor for next page of results and the policies matching the query.
