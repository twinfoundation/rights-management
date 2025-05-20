// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property } from "@twin.org/entity";

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
	 * The context for the policy.
	 */
	@property({ type: "string" })
	public "@context"!: string;

	/**
	 * The type of policy.
	 */
	@property({ type: "string" })
	public "@type"!: string;

	/**
	 * The profile(s) this policy conforms to.
	 */
	@property({ type: "string", optional: true })
	public profile?: string | string[];

	/**
	 * The assigner of the policy.
	 */
	@property({ type: "string", optional: true })
	public assigner?: string;

	/**
	 * The assignee of the policy.
	 */
	@property({ type: "string", optional: true })
	public assignee?: string;

	/**
	 * The target asset for the rule.
	 */
	@property({ type: "string", optional: true })
	public target?: string | string[];

	/**
	 * The action associated with the rule.
	 */
	@property({ type: "string", optional: true })
	public action?: string;

	/**
	 * The conflict resolution strategy.
	 */
	@property({ type: "string", optional: true })
	public conflict?: string;

	/**
	 * The permissions in the policy as JSON string.
	 */
	@property({ type: "string", optional: true })
	public permission?: string;

	/**
	 * The prohibitions in the policy as JSON string.
	 */
	@property({ type: "string", optional: true })
	public prohibition?: string;

	/**
	 * The obligations in the policy as JSON string.
	 */
	@property({ type: "string", optional: true })
	public obligation?: string;
}
