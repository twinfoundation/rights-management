# Class: RightsManagementPapService

Service for performing Policy Administration Point operations.

## Implements

- `IPolicyAdministrationPointComponent`

## Constructors

### Constructor

> **new RightsManagementPapService**(`options?`): `RightsManagementPapService`

Create a new instance of RightsManagementPapService.

#### Parameters

##### options?

[`IPolicyAdministrationPointServiceConstructorOptions`](../interfaces/IPolicyAdministrationPointServiceConstructorOptions.md)

The options for the service.

#### Returns

`RightsManagementPapService`

## Properties

### NAMESPACE

> `readonly` `static` **NAMESPACE**: `string` = `"pap"`

The namespace supported by the PAP service.

***

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

`IPolicyAdministrationPointComponent.CLASS_NAME`

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

#### Implementation of

`IPolicyAdministrationPointComponent.store`

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

#### Implementation of

`IPolicyAdministrationPointComponent.retrieve`

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

#### Implementation of

`IPolicyAdministrationPointComponent.remove`

***

### query()

> **query**(`conditions?`, `cursor?`): `Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

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

#### Implementation of

`IPolicyAdministrationPointComponent.query`
