// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { RightsManagementClient } from "../src/rightsManagementClient";

describe("RightsManagementClient", () => {
	test("Can create an instance", async () => {
		const client = new RightsManagementClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
