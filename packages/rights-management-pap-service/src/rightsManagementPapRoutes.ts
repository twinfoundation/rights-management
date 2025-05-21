// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	ICreatedResponse,
	IHttpRequestContext,
	INoContentResponse,
	IRestRoute,
	ITag
} from "@twin.org/api-models";
import { ComponentFactory, Guards } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type {
	IPolicyAdministrationPointComponent,
	IPapStoreRequest,
	IPapRetrieveRequest,
	IPapRetrieveResponse,
	IPapRemoveRequest,
	IPapQueryRequest,
	IPapQueryResponse
} from "@twin.org/rights-management-models";
import { HttpStatusCode } from "@twin.org/web";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "rightsManagementPapRoutes";

/**
 * The tag to associate with the routes.
 */
export const tagsPap: ITag[] = [
	{
		name: "PAP",
		description: "Endpoints for Policy Administration Point operations."
	}
];

/**
 * The REST routes for Policy Administration Point.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param componentName The name of the component to use in the routes stored in the ComponentFactory.
 * @returns The generated routes.
 */
export function generateRestRoutesPap(baseRouteName: string, componentName: string): IRestRoute[] {
	const storeRoute: IRestRoute<IPapStoreRequest, ICreatedResponse> = {
		operationId: "papStore",
		summary: "Store a policy",
		tag: tagsPap[0].name,
		method: "POST",
		path: `${baseRouteName}/`,
		handler: async (httpRequestContext, request) =>
			papStore(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapStoreRequest>(),
			examples: [
				{
					id: "papStoreExample",
					request: {
						body: {
							policy: {
								"@context": "https://www.w3.org/ns/odrl.jsonld",
								"@type": "Set",
								uid: "http://example.com/policy/1",
								permission: [
									{
										target: "http://example.com/asset/1",
										action: "use"
									}
								]
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<ICreatedResponse>(),
				examples: [
					{
						id: "papStoreResponseExample",
						response: {
							statusCode: HttpStatusCode.created,
							headers: {
								location: "http://example.com/policy/1"
							}
						}
					}
				]
			}
		]
	};

	const retrieveRoute: IRestRoute<IPapRetrieveRequest, IPapRetrieveResponse> = {
		operationId: "papRetrieve",
		summary: "Retrieve a policy",
		tag: tagsPap[0].name,
		method: "GET",
		path: `${baseRouteName}/:id`,
		handler: async (httpRequestContext, request) =>
			papRetrieve(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapRetrieveRequest>(),
			examples: [
				{
					id: "papRetrieveExample",
					request: {
						pathParams: {
							id: "http://example.com/policy/1"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPapRetrieveResponse>(),
				examples: [
					{
						id: "papRetrieveResponseExample",
						response: {
							body: {
								"@context": "https://www.w3.org/ns/odrl.jsonld",
								"@type": "Set",
								uid: "http://example.com/policy/1",
								permission: [
									{
										target: "http://example.com/asset/1",
										action: "use"
									}
								]
							}
						}
					}
				]
			}
		]
	};

	const removeRoute: IRestRoute<IPapRemoveRequest, INoContentResponse> = {
		operationId: "papRemove",
		summary: "Remove a policy",
		tag: tagsPap[0].name,
		method: "DELETE",
		path: `${baseRouteName}/:id`,
		handler: async (httpRequestContext, request) =>
			papRemove(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapRemoveRequest>(),
			examples: [
				{
					id: "papRemoveExample",
					request: {
						pathParams: {
							id: "http://example.com/policy/1"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<INoContentResponse>()
			}
		]
	};

	const queryRoute: IRestRoute<IPapQueryRequest, IPapQueryResponse> = {
		operationId: "papQuery",
		summary: "Query policies",
		tag: tagsPap[0].name,
		method: "POST",
		path: `${baseRouteName}/query`,
		handler: async (httpRequestContext, request) =>
			papQuery(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IPapQueryRequest>(),
			examples: [
				{
					id: "papQueryExample",
					request: {
						query: {
							cursor: "optional-pagination-cursor"
						},
						body: {
							conditions: {
								property: "@type",
								value: "Set",
								comparison: "equals"
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IPapQueryResponse>(),
				examples: [
					{
						id: "papQueryResponseExample",
						response: {
							body: {
								cursor: "next-page-cursor",
								policies: [
									{
										"@context": "https://www.w3.org/ns/odrl.jsonld",
										"@type": "Set",
										uid: "http://example.com/policy/1",
										permission: [
											{
												target: "http://example.com/asset/1",
												action: "use"
											}
										]
									}
								]
							}
						}
					}
				]
			}
		]
	};

	return [storeRoute, retrieveRoute, removeRoute, queryRoute];
}

/**
 * Store a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papStore(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapStoreRequest
): Promise<ICreatedResponse> {
	Guards.object(ROUTES_SOURCE, nameof(request.body.policy), request.body.policy);

	const policyId = request.body.policy.uid;
	Guards.stringValue(ROUTES_SOURCE, nameof(policyId), policyId);

	const pap = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);
	await pap.store(request.body.policy);

	return {
		statusCode: HttpStatusCode.created,
		headers: {
			location: policyId
		}
	};
}

/**
 * Retrieve a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papRetrieve(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapRetrieveRequest
): Promise<IPapRetrieveResponse> {
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);

	const pap = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);
	const policy = await pap.retrieve(request.pathParams.id);

	return {
		body: policy
	};
}

/**
 * Remove a policy.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papRemove(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapRemoveRequest
): Promise<INoContentResponse> {
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);

	const pap = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);
	await pap.remove(request.pathParams.id);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * Query policies.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function papQuery(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IPapQueryRequest
): Promise<IPapQueryResponse> {
	const cursor = request.query?.cursor;
	const conditions = request.body?.conditions;

	const pap = ComponentFactory.get<IPolicyAdministrationPointComponent>(componentName);
	const result = await pap.query(conditions, cursor);

	return {
		body: result
	};
}
