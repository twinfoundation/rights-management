# Interface: IPolicyManagementPointComponent

Interface describing a Policy Management Point (PMP) contract.
Provide the policies to the PDP based on the data and identities.

## Extends

- `IComponent`

## Methods

### retrieve()

> **retrieve**(`data`, `userIdentity`, `nodeIdentity`): `Promise`\<`IOdrlPolicy`[]\>

Get the policies from a PAP based on the data and identities.

#### Parameters

##### data

`IJsonLdNodeObject`

The data to retrieve the policies for.

##### userIdentity

`string`

The user identity to retrieve the policies for.

##### nodeIdentity

`string`

The node identity to retrieve the policies for.

#### Returns

`Promise`\<`IOdrlPolicy`[]\>

Returns the policies which apply to the data and identities so that the PDP can make a decision.
