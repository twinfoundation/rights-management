# Class: RightsManagementService

Service for performing Rights Management operations.
This is a unified service that provides access to all Rights Management components.

## Implements

- `IRightsManagementComponent`

## Constructors

### Constructor

> **new RightsManagementService**(`options?`): `RightsManagementService`

Create a new instance of RightsManagementService.

#### Parameters

##### options?

[`IRightsManagementServiceConstructorOptions`](../interfaces/IRightsManagementServiceConstructorOptions.md)

The options for the service.

#### Returns

`RightsManagementService`

## Properties

### NAMESPACE

> `readonly` `static` **NAMESPACE**: `string` = `"rights-management"`

The namespace supported by the Rights Management service.

***

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IRightsManagementComponent.CLASS_NAME`

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

#### Implementation of

`IRightsManagementComponent.papStore`

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

#### Implementation of

`IRightsManagementComponent.papRetrieve`

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

#### Implementation of

`IRightsManagementComponent.papRemove`

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

#### Implementation of

`IRightsManagementComponent.papQuery`
