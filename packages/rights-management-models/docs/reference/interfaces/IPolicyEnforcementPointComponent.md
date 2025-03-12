# Interface: IPolicyEnforcementPointComponent

Interface describing a Policy Enforcement Point (PEP) contract.
Intercepts data and uses the Policy Decision Point (PDP) to make decisions on
access to a resource, based on the decision a manipulated data object can
be returned.

## Extends

- `IComponent`

## Methods

### intercept()

> **intercept**(`data`, `userIdentity`, `nodeIdentity`): `Promise`\<`IJsonLdNodeObject`\>

Process the data using Policy Decision Point (PDP) and return the manipulated data.

#### Parameters

##### data

`IJsonLdNodeObject`

The data to process.

##### userIdentity

`string`

The user identity to use in the decision making.

##### nodeIdentity

`string`

The node identity to use in the decision making.

#### Returns

`Promise`\<`IJsonLdNodeObject`\>

The manipulated data with any policies applied.
