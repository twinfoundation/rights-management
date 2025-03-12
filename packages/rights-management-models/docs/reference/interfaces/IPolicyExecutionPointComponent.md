# Interface: IPolicyExecutionPointComponent

Interface describing a Policy Execution Point (PXP) contract.
When a decision is made by the Policy Decision Point (PDP),
the Policy Execution Point (PEP) will execute any
registered actions based on the decision.

## Extends

- `IComponent`

## Methods

### executeActions()

> **executeActions**(`data`, `userIdentity`, `nodeIdentity`, `policies`): `Promise`\<`void`\>

Execute actions based on the PDP's decisions.

#### Parameters

##### data

`IJsonLdNodeObject`

The data used in the decision by the PDP.

##### userIdentity

`string`

The user identity to use in the decision making.

##### nodeIdentity

`string`

The node identity to use in the decision making.

##### policies

`IOdrlPolicy`[]

The policies that apply to the data.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### registerAction()

> **registerAction**(`actionId`, `action`): `Promise`\<`void`\>

Register an action to be executed.

#### Parameters

##### actionId

`string`

The id of the action to register.

##### action

(`data`, `userIdentity`, `nodeIdentity`, `policies`) => `Promise`\<`void`\>

The action to execute.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### unregisterAction()

> **unregisterAction**(`actionId`): `Promise`\<`void`\>

Unregister an action from the execution point.

#### Parameters

##### actionId

`string`

The id of the action to unregister.

#### Returns

`Promise`\<`void`\>

Nothing.
