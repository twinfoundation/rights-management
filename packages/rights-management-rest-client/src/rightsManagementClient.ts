// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import {
	HttpParameterHelper,
	type IBaseRestClientConfig,
	type ICreatedResponse
} from "@twin.org/api-models";
import { Coerce, Guards } from "@twin.org/core";
import type { EntityCondition } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import type {
	IPapCreateRequest,
	IPapQueryRequest,
	IPapQueryResponse,
	IPapRemoveRequest,
	IPapRetrieveRequest,
	IPapRetrieveResponse,
	IPapUpdateRequest,
	IRightsManagementComponent
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";

/**
 * Client for performing Rights Management through to REST endpoints.
 */
export class RightsManagementClient extends BaseRestClient implements IRightsManagementComponent {
	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<RightsManagementClient>();

	/**
	 * Create a new instance of RightsManagementClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(nameof<RightsManagementClient>(), config, "rights-management");
	}

	/**
	 * PAP: Create a new policy with auto-generated UID.
	 * @param policy The policy to create (uid will be auto-generated).
	 * @returns The UID of the created policy.
	 */
	public async papCreate(policy: Omit<IOdrlPolicy, "uid">): Promise<string> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);

		const response = await this.fetch<IPapCreateRequest, ICreatedResponse>("/pap", "POST", {
			body: policy
		});

		return response.headers.location;
	}

	/**
	 * PAP: Update an existing policy.
	 * @param policy The policy to update (must include uid).
	 * @returns Nothing.
	 */
	public async papUpdate(policy: IOdrlPolicy): Promise<void> {
		Guards.object(this.CLASS_NAME, nameof(policy), policy);
		Guards.stringValue(this.CLASS_NAME, "policy.uid", policy.uid);

		await this.fetch<IPapUpdateRequest, never>("/pap/:id", "PUT", {
			pathParams: {
				id: policy.uid
			},
			body: policy
		});
	}

	/**
	 * PAP: Retrieve a policy.
	 * @param policyId The id of the policy to retrieve.
	 * @returns The policy.
	 */
	public async papRetrieve(policyId: string): Promise<IOdrlPolicy> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		const response = await this.fetch<IPapRetrieveRequest, IPapRetrieveResponse>(
			"/pap/:id",
			"GET",
			{
				pathParams: {
					id: policyId
				}
			}
		);

		return response.body;
	}

	/**
	 * PAP: Remove a policy.
	 * @param policyId The id of the policy to remove.
	 * @returns Nothing.
	 */
	public async papRemove(policyId: string): Promise<void> {
		Guards.stringValue(this.CLASS_NAME, nameof(policyId), policyId);

		await this.fetch<IPapRemoveRequest, never>("/pap/:id", "DELETE", {
			pathParams: {
				id: policyId
			}
		});
	}

	/**
	 * PAP: Query the policies using the specified conditions.
	 * @param conditions The conditions to use for the query.
	 * @param cursor The cursor to use for pagination.
	 * @param pageSize The number of results to return per page.
	 * @returns Cursor for next page of results and the policies matching the query.
	 */
	public async papQuery(
		conditions?: EntityCondition<IOdrlPolicy>,
		cursor?: string,
		pageSize?: number
	): Promise<{
		cursor?: string;
		policies: IOdrlPolicy[];
	}> {
		const response = await this.fetch<IPapQueryRequest, IPapQueryResponse>("/pap/query", "GET", {
			query: {
				cursor,
				conditions: HttpParameterHelper.objectToString(conditions),
				pageSize: Coerce.string(pageSize)
			}
		});

		return response.body;
	}
}
