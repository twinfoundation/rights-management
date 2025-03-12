# Interface: IPolicyInformationPointComponent

Interface describing a Policy Information Point (PEP) contract.
Provides additional information to the Policy Decision Point (PDP) when
it is making decisions.

## Extends

- `IComponent`

## Methods

### retrieve()

> **retrieve**(`data`, `userIdentity`, `nodeIdentity`): `Promise`\<`IJsonLdNodeObject`[]\>

Retrieve additional information which is relevant in the PDP decision making.

#### Parameters

##### data

`IJsonLdNodeObject`

The data to get any additional information for.

##### userIdentity

`string`

The user identity to get additional information for.

##### nodeIdentity

`string`

The node identity to get additional information for.

#### Returns

`Promise`\<`IJsonLdNodeObject`[]\>

Returns additional information based on the data and identities.
