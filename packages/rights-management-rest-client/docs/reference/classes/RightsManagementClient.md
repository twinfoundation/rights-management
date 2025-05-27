# Class: RightsManagementClient

Client for performing Rights Management through to REST endpoints.

## Extends

- `BaseRestClient`

## Constructors

### Constructor

> **new RightsManagementClient**(`config`): `RightsManagementClient`

Create a new instance of RightsManagementClient.

#### Parameters

##### config

`IBaseRestClientConfig`

The configuration for the client.

#### Returns

`RightsManagementClient`

#### Overrides

`BaseRestClient.constructor`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### papStore()

> **papStore**(`policy`): `Promise`\<`void`\>

PAP: Store a policy.

#### Parameters

##### policy

`IOdrlPolicy`

The policy to store.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### papRetrieve()

> **papRetrieve**(`policyId`): `Promise`\<`IOdrlPolicy`\>

PAP: Retrieve a policy.

#### Parameters

##### policyId

`string`

The id of the policy to retrieve.

#### Returns

`Promise`\<`IOdrlPolicy`\>

The policy.

***

### papRemove()

> **papRemove**(`policyId`): `Promise`\<`void`\>

PAP: Remove a policy.

#### Parameters

##### policyId

`string`

The id of the policy to remove.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### papQuery()

> **papQuery**(`conditions?`, `cursor?`, `pageSize?`): `Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

PAP: Query the policies using the specified conditions.

#### Parameters

##### conditions?

`string`

The conditions to use for the query.

##### cursor?

`string`

The cursor to use for pagination.

##### pageSize?

`number`

The number of results to return per page.

#### Returns

`Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Cursor for next page of results and the policies matching the query.
