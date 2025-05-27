# Interface: IRightsManagementComponent

Interface describing a unified Rights Management Component.
This serves as a single point of entry for all rights management operations.

## Extends

- `IComponent`

## Methods

### papStore()

> **papStore**(`policy`, `nodeIdentity`, `userIdentity?`): `Promise`\<`void`\>

PAP: Store a policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to store.

##### nodeIdentity

`string`

The identity of the node the operation is performed on.

##### userIdentity?

`string`

The identity of the user performing the operation.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### papRetrieve()

> **papRetrieve**(`policyId`, `nodeIdentity`, `userIdentity?`): `Promise`\<`IOdrlPolicy`\>

PAP: Retrieve a policy.

#### Parameters

##### policyId

`string`

The id of the policy to retrieve.

##### nodeIdentity

`string`

The identity of the node the operation is performed on.

##### userIdentity?

`string`

The identity of the user performing the operation.

#### Returns

`Promise`\<`IOdrlPolicy`\>

The policy.

***

### papRemove()

> **papRemove**(`policyId`, `nodeIdentity`, `userIdentity?`): `Promise`\<`void`\>

PAP: Remove a policy.

#### Parameters

##### policyId

`string`

The id of the policy to remove.

##### nodeIdentity

`string`

The identity of the node the operation is performed on.

##### userIdentity?

`string`

The identity of the user performing the operation.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### papQuery()

> **papQuery**(`nodeIdentity`, `conditions?`, `cursor?`, `pageSize?`, `userIdentity?`): `Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

PAP: Query the policies using the specified conditions.

#### Parameters

##### nodeIdentity

`string`

The identity of the node the operation is performed on.

##### conditions?

`string`

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

#### Returns

`Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Cursor for next page of results and the policies matching the query.
