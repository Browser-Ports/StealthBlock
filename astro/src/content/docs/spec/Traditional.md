---
title: Traditional (legacy) filter lists
---

All official StealthBlock implementations will have everything implemented from uBlock Origin and uBlock origin. Anything that can work with sandboxing will be done first, then if there needs to be any request blocking, the rule will be turned into a dynamic rule for `declarativeWebRequest`.

In this, there isn't going to be anything added to the filter lists, only slight things removed. This is more of an implementation guide for official Stealthblock implementations.

See the traditional filter lists: [uBlock](https://github.com/gorhill/ublock/wiki)

# What's different?

## Pre-parsing directives

## Conditions

These [conditions](https://github.com/gorhill/ublock/wiki/static-filter-syntax#if-condition) shall not be implemented:

    - `env_mv3`: this is because, in the official mv3 extension, there will be no restrictions. Use of this will be ignored.

# How it shall be implemented

## For MV3

1. If there needs to be any request blocking, the rule will be turned into a [dynamic rule for declarativeWebRequest](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest) with it being a safe DNR rule, but if that is not possible, it will be a dynamic rule
2. If a new rule can't be added:
   - [it is a dynamic rule and there are already 5000](https://developer.chrome.com/blog/improvements-to-content-filtering-in-manifest-v3#:~:text=dynamic%20net%20request%20rules%20stays%20at%205%2C000.),
   - [it is a safe dnr rule, and there are already 30,000](https://developer.chrome.com/blog/improvements-to-content-filtering-in-manifest-v3#:~:text=higher%20limit%20of%2030%2C000%20rules%20applies%20to%20safe%20DNR%20rules),
   - [AeroSandbox](https://github.com/vortexdl/aero/tree/unstable/src/AeroSandbox) will block the site by emulating the blocking by preventing the web feature from being used and throwing a `NetworkError`
   - AeroSandbox isn't finished yet, so for any type of request blocking that hasn't been done yet (remember, we need to emulate the network request errors), we will fallback to [doing the same methods in MV2]() (skipping #1 obviously). Since MV2 APIs aren't in MV3, [MV2-Polyfills-For-MV3](https://github.com/Browser-Ports/MV2-Polyfills-for-MV3) will be used, however since that may route the user's requests into an HTTP proxy, the user will be warned and asked for their consent. The user will have the option of forgoing the sandbox entirely to do the MV2 methods only. 

## For MV2

1. Anything rule that can work with sandboxing will be done first
2. TODO: ...(finish writing)