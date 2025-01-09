// @ts-ignore
import { ApiInterceptor } from "aero-sandbox/apiInterceptorTypes";

/**
 * If the user tries to install any filters that have unsafe overrides, they will be warned of those overrides before installing
 * Any listeners on these filters will never have access to fetch, XHR, beacon, or any other API that could be used to send data to an external server. They will be sandboxed and isolated.
 */
interface FilterList {
	/**
	 * The name of the filter list
	 */
	name: string;
	/**
	 * The short name of the filter list
	 */
	shortName: string;
	/** What the filter list is for */
	description: string;
	author: string;
	update_url: string;
	extends_lite_filter_list_url: string;
	/**
	 * A list of newline-separated Adguard rules that have the content types in a similar way to Lite
	 */
	concealResources?: string[];
	filters?: {
		/**
		 * A basic rule in Adguard filter lists, but all content type modifiers are ignored, because it only targets documents @see https://adguard.com/kb/general/ad-filtering/create-own-filters/#basic-rules-basic-modifiers
		 */
		match: string;
		interceptApi: /**
		 * You will not be allowed to use a normal `ApiInterceptor` for the fetch API from AeroSandbox. If you try to define one here, it would be ignored. Additionally a warning would be logged.
		 */
			| ApiInterceptor
			| {
					FetchInterceptor: FetchInterceptor;
			  };
		/**
		 * Unlike every other Adblocker filter list type, StealthBlock doesn't just prevent the request from happening, it hides the Element that the asset is for in the DOM
		 */
		styleInjects?: {
			/**
			 * A basic rule in Adguard filter lists, but all content type modifiers are ignored, because it only targets documents @see https://adguard.com/kb/general/ad-filtering/create-own-filters/#basic-rules-basic-modifiers
			 */
			match: string;
			/**
			 * Remember, the HTML element will be faked using *AeroSandbox*'s Faker API
			 */
			style: string;
		}[];
		/**
		 * This is ideally done by intercepting the Request, which can be done in MV2 web extensions and in proxy middleware, not in limited environments like UserScripts and MV3 web extensions. In those environments, this will have to use Mutation Observers.
		 * You should use this if the element you are targeting isn't created later, because it doesn't have the overhead of a Mutation Observer. Keep in mind though, if you are going to do something like observe the entire DOM, you're going to take that performance hit anyway, so just do everything in Mutation Observers instead. This also tells AeroSandbox to conceal every Element that is added to the DOM, so it still has a slight bit of added overhead to the site.
		 * You also shouldn't use this if you are just going to hide the Element with CSS, because that would be a waste of resources.
		 */
		elementRewriters?: {
			/**
			 * In the form of Adguard-extended CSS selectors @see https://adguard.com/kb/general/ad-filtering/create-own-filters/#extended-css-selectors
			 */
			matches: string[];
			/**
			 * Remember, the HTML element will be faked using *AeroSandbox*'s Faker API
			 */
			rewriter: (element: HTMLElement) => void;
		}[];
		/**
		 * These let you a Mutation Observers later, where when you change something about a Node, it will be faked using *AeroSandbox*'s Faker API
		 * These are before the DOM starts loading
		 *
		 * Example of hiding GDPR notice on @see https://etools.ch (it would've been better to use CSS injection, but this is just an example):
		 * @example
		 * {
		 *   ...,
		 *   mutationConcealers: {
		 *      callback(mutation) {
		 *         mutation.addedNodes.forEach(node => {
		 *           if (node.className.includes("cmpwrapper"))
		 *             node.remove();
		 *         });
		 *      },
		 *      {
		 *        target: document.body,
		 *        options: {
		 *          childList: true
		 *        }
		 *      }
		 *   }
		 * }
		 */
		mutationConcealers: {
			callback: MutationCallback;
			observeOptions: {
				target: Node;
				options: MutationObserverInit;
			};
		}[];
	}[];
	unsafeOverrides?: {
		/**
		 * If the resource is for an image, a StealthBlock implementation will define an API Interceptor on the site (which overrides any that may be defined in interceptApi) for `Image.prototype.getImageData`, `img.naturalWidth`, and `img.naturalHeight`
		 * Here's what the interceptor does:
		 *   - It gets the would've been (if we didn't override it with a filter list earlier) Image data if it doesn't already have it (checks a `WeakMap`)
		 *   - That API Interceptor fetches the image at `Image.prototype.src`, with the same headers that the original request would've had
		 *   - It blobs the image data (for the Image that would've been),
		 *   - It sets the `src` of a new `Image` (the Image that would've been) to the blob URL
		 *   - It calls `Reflect.construct` finish constructing the target `Image` (for the asset) object
		 *   - It will define new `Proxy` objects on the target `Image` to conceal the real image data, with the image data for the `Image` that would've been, so that if the target `Image` object is used in a way that would reveal the image data, it would be concealed. This involves defining a new `Proxy` object for `Image.getImageData`, `Image.naturalWidth`, and `Image.naturalHeight`, with each just calling the equivalents on the `Image` that would've been.
		 *   - It returns the target `Image` object
		 */
		doNotConcealImageData: boolean;
	};
}

/**
 * This also gets triggered for XHR requests
 * This is done, so that the user of any StealthBlock implementation can disable API interceptors that might reveal their identity to an external server, because if a normal API Interceptor was used, the proxy handler would expose the fetch API, which we try to sandbox in all of the other API Interceptors.
 *
 * Note: If you want to intercept the Fetch API, you must enable the override `interceptFetch`. You must be very careful when using this, because if you mess with the client <-> server communication, you could get the Adblocker detected.
 */
interface FetchInterceptor {
	/**
	 * If you want to try to modify the request URL, you need to enable the fetch override `allowModifyingRequestURL` to be true. This is done to prevent the leaking data to a potentially malicious server.
	 * If you don't specify the override properly, the change in the request URL would be ignored and it would be logged as a warning.
	 *
	 * @param {Request} - The request that is going to be sent
	 * @param {boolean | string} - Whether the request from the XHR API and if it is: is it from sync XHRs?
	 */
	beforeFetchRequest: (req: Request, isXHR: boolean | "sync") => {};
	/**
	 * @param res - The response before it is returned back to whomever called the APIs
	 * @param isXHR - Whether the request from the XHR API and if it is: is it from sync XHRs?
	 * @returns The response that will be returned back to whomever called the APIs
	 */
	beforeReturnResponse: (res: Response, isXHR: boolean | "sync") => {};
	unsafeOverrides?: {
		interceptFetch: boolean;
		allowModifyingRequestURL: boolean;
	};
}
