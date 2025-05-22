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
import type { EntityCondition } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import type {
	IPapQueryRequest,
	IPapQueryResponse,
	IPapRemoveRequest,
	IPapRetrieveRequest,
	IPapRetrieveResponse,
	IPapStoreRequest,
	IRightsManagementComponent
} from "@twin.org/rights-management-models";
import type { IOdrlPolicy } from "@twin.org/standards-w3c-odrl";
import { HeaderTypes, HttpStatusCode } from "@twin.org/web";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "rightsManagementRoutes";

/**
 * The tag to associate with the PAP routes.
 */
export const tagsPap: ITag[] = [
	{
		name: "Policy Administration Point",
		description: "Endpoints for managing ODRL policies in the Policy Administration Point"
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
								[HeaderTypes.Location]: "http://example.com/policy/1"
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
 * PAP: Store a policy.
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
	Guards.object<IPapStoreRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapStoreRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);
	Guards.object(ROUTES_SOURCE, nameof(request.body.policy), request.body.policy);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);

	const policy = request.body.policy;
	await component.papStore(policy, httpRequestContext.userIdentity);

	return {
		statusCode: HttpStatusCode.created,
		headers: {
			[HeaderTypes.Location]: policy.uid ?? ""
		}
	};
}

/**
 * PAP: Retrieve a policy.
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
	Guards.object<IPapRetrieveRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapRetrieveRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	const policy = await component.papRetrieve(
		request.pathParams.id,
		httpRequestContext.userIdentity
	);

	return {
		body: policy
	};
}

/**
 * PAP: Remove a policy.
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
	Guards.object<IPapRemoveRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IPapRemoveRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.stringValue(ROUTES_SOURCE, nameof(request.pathParams.id), request.pathParams.id);

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	await component.papRemove(request.pathParams.id, httpRequestContext.userIdentity);

	return {
		statusCode: HttpStatusCode.noContent
	};
}

/**
 * PAP: Query policies.
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
	Guards.object<IPapQueryRequest>(ROUTES_SOURCE, nameof(request), request);

	// Extract conditions and cursor
	const conditions: EntityCondition<IOdrlPolicy> | undefined = request.body?.conditions;
	const cursor: string | undefined = request.query?.cursor;

	const component = ComponentFactory.get<IRightsManagementComponent>(componentName);
	const result = await component.papQuery(conditions, cursor, httpRequestContext.userIdentity);

	return {
		body: {
			cursor: result.cursor,
			policies: result.policies
		}
	};
}
