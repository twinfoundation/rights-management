# Class: OdrlPolicy

Class describing an ODRL policy for entity storage.
This class represents the storage model for Open Digital Rights Language (ODRL) policies
in the Policy Administration Point (PAP) component. It is used as the database model
by the entityStorage configuration in IPolicyAdministrationPointComponentOptions.

The entity storage component uses this class to persist ODRL policies with their
permissions, prohibitions, and obligations in a structured format that can be
efficiently queried and managed by the Policy Administration Point.

## Constructors

### Constructor

> **new OdrlPolicy**(): `OdrlPolicy`

#### Returns

`OdrlPolicy`

## Properties

### uid

> **uid**: `string`

The unique identifier for the policy.

***

### @context

> **@context**: `string`

The context for the policy.

***

### @type

> **@type**: `string`

The type of policy.

***

### profile?

> `optional` **profile**: `string` \| `string`[]

The profile(s) this policy conforms to.

***

### assigner?

> `optional` **assigner**: `string`

The assigner of the policy.

***

### assignee?

> `optional` **assignee**: `string`

The assignee of the policy.

***

### target?

> `optional` **target**: `string` \| `string`[]

The target asset for the rule.

***

### action?

> `optional` **action**: `string`

The action associated with the rule.

***

### conflict?

> `optional` **conflict**: `string`

The conflict resolution strategy.

***

### permission?

> `optional` **permission**: `string`

The permissions in the policy as JSON string.

***

### prohibition?

> `optional` **prohibition**: `string`

The prohibitions in the policy as JSON string.

***

### obligation?

> `optional` **obligation**: `string`

The obligations in the policy as JSON string.
