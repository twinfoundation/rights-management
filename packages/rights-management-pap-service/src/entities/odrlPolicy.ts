// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property } from "@twin.org/entity";
import type {
	ActionType,
	ConflictStrategyType,
	IOdrlAction,
	IOdrlAsset,
	IOdrlDuty,
	IOdrlParty,
	IOdrlPermission,
	IOdrlProhibition,
	PolicyType
} from "@twin.org/standards-w3c-odrl";

/**
 * Class describing an ODRL policy for entity storage.
 */
@entity()
export class OdrlPolicy {
	/**
	 * The unique identifier for the policy.
	 */
	@property({ type: "string", isPrimary: true })
	public uid!: string;

	/**
	 * The type of policy.
	 */
	@property({ type: "string" })
	public "@type"!: PolicyType;

	/**
	 * The profile(s) this policy conforms to.
	 */
	@property({ type: "object", optional: true })
	public profile?: string | string[];

	/**
	 * The assigner of the policy.
	 */
	@property({ type: "object", optional: true })
	public assigner?: string | IOdrlParty;

	/**
	 * The assignee of the policy.
	 */
	@property({ type: "object", optional: true })
	public assignee?: string | IOdrlParty;

	/**
	 * The target asset for the rule.
	 */
	@property({ type: "object", optional: true })
	public target?: string | IOdrlAsset | (string | IOdrlAsset)[];

	/**
	 * The action associated with the rule.
	 */
	@property({ type: "object", optional: true })
	public action?: ActionType | IOdrlAction | (ActionType | IOdrlAction)[];

	/**
	 * The conflict resolution strategy.
	 */
	@property({ type: "string", optional: true })
	public conflict?: ConflictStrategyType;

	/**
	 * The permissions in the policy.
	 */
	@property({ type: "array", optional: true })
	public permission?: IOdrlPermission[];

	/**
	 * The prohibitions in the policy.
	 */
	@property({ type: "array", optional: true })
	public prohibition?: IOdrlProhibition[];

	/**
	 * The obligations in the policy.
	 */
	@property({ type: "array", optional: true })
	public obligation?: IOdrlDuty[];
}
