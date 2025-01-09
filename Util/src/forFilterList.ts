// @ts-nocheck

/**
 * @module
 */

/**
 * Does the same thing as a MutationObserver, but any changes you make to the Element will be faked using AeroSandbox's faker API
 * The listeners will not have access to fetch, unless an override is specified
 */
// TODO: Move the MutationConcealer implementation to AeroSandbox instead of in here
for (const filterList of filterList)
	for (const mutationConcealer of filterList.mutationConcealers) {
		new MutationObserver(mutationConcealer);
		new Proxy(MutationObserver.prototype, {
			construct(target, args) {
				let [callback] = args;
				callback = (mutations: MutationRecord) => {
					Object.defineProperties(mutations, {
						addedNodes: {
							value: new Proxy(mutations.addedNodes, {
								get(target, prop, receiver) {
									if (prop === Symbol.iterator)
										return function* () {
											for (const node of Reflect.get(
												target,
												prop,
												receiver
											)) {
												// TODO: Import the aero global types
												yield window.$aero.sandbox.faker.wrapNode(
													node
												);
											}
										};
									return Reflect.get(target, prop, receiver);
								}
							}),
							writable: false
						}
					});
					callback(mutations);
				};
				args[0] = callback;
			}
		});
	}

export default new Proxy(MutationObserver.prototype, {
	construct(target, args) {
		let [callback] = args;
		callback = (mutations: MutationRecord) => {
			Object.defineProperties(mutations, {
				addedNodes: {
					value: new Proxy(mutations.addedNodes, {
						get(target, prop, receiver) {
							if (prop === Symbol.iterator)
								return function* () {
									for (const node of Reflect.get(
										target,
										prop,
										receiver
									)) {
										// TODO: Import the aero global types
										yield window.$aero.sandbox.faker.wrapNode(
											node
										);
									}
								};
							return Reflect.get(target, prop, receiver);
						}
					}),
					writable: false
				}
			});
			callback(mutations);
		};
		args[0] = callback;
	}
});

function createMutationConcealer(
	callback: (callback: MutationCallback) => void
) {}
