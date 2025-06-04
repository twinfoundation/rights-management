# Interface: IPapCreateRequest

The request structure for creating a policy.

## Properties

### body

> **body**: `object`

The body of the request.

#### policy

> **policy**: `Omit`\<`IOdrlPolicy`, `"uid"`\> & `object`

The policy to create (uid is optional and will be auto-generated if not provided).

##### Type declaration

###### uid?

> `optional` **uid**: `string`

The optional unique identifier for the policy.
If not provided, will be auto-generated.
