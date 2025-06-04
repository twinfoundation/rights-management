# Class: PolicyAdministrationPointService

Class implementation of Policy Administration Point Component.

## Implements

- `IPolicyAdministrationPointComponent`

## Constructors

### Constructor

> **new PolicyAdministrationPointService**(`options?`): `PolicyAdministrationPointService`

Create a new instance of PolicyAdministrationPointService (PAP).

#### Parameters

##### options?

[`IPolicyAdministrationPointServiceOptions`](../interfaces/IPolicyAdministrationPointServiceOptions.md)

The options for the component.

#### Returns

`PolicyAdministrationPointService`

## Properties

### NAMESPACE

> `readonly` `static` **NAMESPACE**: `string` = `"pap"`

The namespace supported by the Policy Administration Point entity storage implementation.

***

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

The class name of the Policy Administration Point Service.

#### Implementation of

`IPolicyAdministrationPointComponent.CLASS_NAME`

## Methods

### create()

> **create**(`policy`): `Promise`\<\{ `uid`: `string`; \}\>

Create a new policy with optional UID.

#### Parameters

##### policy

`Omit`\<`IOdrlPolicy`, `"uid"`\> & `object`

The policy to create (uid is optional and will be auto-generated if not provided).

#### Returns

`Promise`\<\{ `uid`: `string`; \}\>

The UID of the created policy.

#### Implementation of

`IPolicyAdministrationPointComponent.create`

***

### update()

> **update**(`policyId`, `updates`): `Promise`\<`IOdrlPolicy`\>

Update an existing policy.

#### Parameters

##### policyId

`string`

The ID of the policy to update.

##### updates

`IOdrlPolicy`

The policy updates to apply.

#### Returns

`Promise`\<`IOdrlPolicy`\>

The updated policy.

#### Implementation of

`IPolicyAdministrationPointComponent.update`

***

### retrieve()

> **retrieve**(`policyId`): `Promise`\<`IOdrlPolicy`\>

Retrieve a policy from the entity storage.

#### Parameters

##### policyId

`string`

The ID of the policy to retrieve.

#### Returns

`Promise`\<`IOdrlPolicy`\>

The policy.

#### Implementation of

`IPolicyAdministrationPointComponent.retrieve`

***

### remove()

> **remove**(`policyId`): `Promise`\<`void`\>

Remove a policy from the entity storage.

#### Parameters

##### policyId

`string`

The ID of the policy to remove.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IPolicyAdministrationPointComponent.remove`

***

### query()

> **query**(`conditions?`, `cursor?`, `pageSize?`): `Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Query the entity storage for policies.

#### Parameters

##### conditions?

`EntityCondition`\<`IOdrlPolicy`\>

The conditions to query the entity storage with.

##### cursor?

`string`

The cursor to use for pagination.

##### pageSize?

`number`

The number of results to return per page.

#### Returns

`Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

The policies.

#### Implementation of

`IPolicyAdministrationPointComponent.query`
