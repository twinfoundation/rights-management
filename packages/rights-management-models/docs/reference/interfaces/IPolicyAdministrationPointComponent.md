# Interface: IPolicyAdministrationPointComponent

Interface describing a Policy Administration Point (PAP) contract.
Manages policies for the rights management, policies are also queried by the
Policy Management Point (PMP) when it handles requests from the Policy Decision Point (PDP).

## Extends

- `IComponent`

## Methods

### store()

> **store**(`policy`, `userIdentity`, `nodeIdentity`): `Promise`\<`void`\>

Store a policy.

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

### retrieve()

> **retrieve**(`policyId`, `userIdentity`, `nodeIdentity`): `Promise`\<`IOdrlPolicy`\>

Retrieve a policy.

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

### remove()

> **remove**(`policyId`, `userIdentity`, `nodeIdentity`): `Promise`\<`void`\>

Remove a policy.

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

### query()

> **query**(`conditions?`, `cursor?`, `pageSize?`, `userIdentity?`, `nodeIdentity?`): `Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Query the policies using the specified conditions.

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
