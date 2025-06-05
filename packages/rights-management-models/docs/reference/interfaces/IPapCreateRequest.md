# Interface: IPapCreateRequest

The request structure for creating a policy.

## Properties

### body

> **body**: `object`

The body of the request.

#### policy

> **policy**: `Omit`\<`IOdrlPolicy`, `"uid"`\>

The policy to create (uid will be auto-generated).
