# Class: PolicyAdministrationPointComponentEntityStorage

Class implementation of Policy Administration Point Component that uses Entity Storage.

## Implements

- `IPolicyAdministrationPointComponent`

## Constructors

### Constructor

> **new PolicyAdministrationPointComponentEntityStorage**(`options`): `PolicyAdministrationPointComponentEntityStorage`

Create a new instance of PolicyAdministrationPointComponent.

#### Parameters

##### options

[`IPolicyAdministrationPointComponentEntityStorageOptions`](../interfaces/IPolicyAdministrationPointComponentEntityStorageOptions.md)

The options for the component.

#### Returns

`PolicyAdministrationPointComponentEntityStorage`

## Properties

### NAMESPACE

> `readonly` `static` **NAMESPACE**: `string` = `"entity-storage"`

The namespace supported by the Policy Administration Point entity storage implementation.

***

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

The class name of the Policy Administration Point Component.

#### Implementation of

`IPolicyAdministrationPointComponent.CLASS_NAME`

## Methods

### store()

> **store**(`policy`, `nodeIdentity`, `userIdentity?`): `Promise`\<`void`\>

Store a policy in the entity storage.

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

#### Implementation of

`IPolicyAdministrationPointComponent.store`

***

### retrieve()

> **retrieve**(`policyId`, `nodeIdentity`, `userIdentity?`): `Promise`\<`IOdrlPolicy`\>

Retrieve a policy from the entity storage.

#### Parameters

##### policyId

`string`

The ID of the policy to retrieve.

##### nodeIdentity

`string`

The identity of the node the operation is performed on.

##### userIdentity?

`string`

The identity of the user performing the operation.

#### Returns

`Promise`\<`IOdrlPolicy`\>

The policy.

#### Implementation of

`IPolicyAdministrationPointComponent.retrieve`

***

### remove()

> **remove**(`policyId`, `nodeIdentity`, `userIdentity?`): `Promise`\<`void`\>

Remove a policy from the entity storage.

#### Parameters

##### policyId

`string`

The ID of the policy to remove.

##### nodeIdentity

`string`

The identity of the node the operation is performed on.

##### userIdentity?

`string`

The identity of the user performing the operation.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IPolicyAdministrationPointComponent.remove`

***

### query()

> **query**(`nodeIdentity`, `conditions?`, `cursor?`, `pageSize?`, `userIdentity?`): `Promise`\<\{ `cursor`: `string`; `policies`: `IOdrlPolicy`[]; \}\>

Query the entity storage for policies.

#### Parameters

##### nodeIdentity

`string`

The identity of the node the operation is performed on.

##### conditions?

`EntityCondition`\<`IOdrlPolicy`\>

The conditions to query the entity storage with.

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

The policies.

#### Implementation of

`IPolicyAdministrationPointComponent.query`
