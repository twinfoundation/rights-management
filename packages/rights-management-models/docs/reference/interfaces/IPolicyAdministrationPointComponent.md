# Interface: IPolicyAdministrationPointComponent

Interface describing a Policy Administration Point (PAP) contract.
Manages policies for the rights management, policies are also retrieved by the
Policy Management Point (PMP) when it handles requests from the Policy Decision Point (PDP).

## Extends

- `IComponent`

## Methods

### store()

> **store**(`policy`): `Promise`\<`void`\>

Store a policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to store.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### retrieve()

> **retrieve**(`policyId`): `Promise`\<`IOdrlPolicy`\>

Retrieve a policy.

#### Parameters

##### policyId

`string`

The id of the policy to retrieve.

#### Returns

`Promise`\<`IOdrlPolicy`\>

The policy.

***

### remove()

> **remove**(`policyId`): `Promise`\<`void`\>

Remove a policy.

#### Parameters

##### policyId

`string`

The id of the policy to remove.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### query()

> **query**(`conditions`?, `cursor`?): `Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Query the policies using the specified conditions.

#### Parameters

##### conditions?

`EntityCondition`\<`IOdrlPolicy`\>

The conditions to use for the query.

##### cursor?

`string`

The cursor to use for pagination.

#### Returns

`Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Cursor for next page of results and the policies matching the query.
