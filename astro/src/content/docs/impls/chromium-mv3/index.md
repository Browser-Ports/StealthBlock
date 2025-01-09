---
title: MV3 port of StealthBlock (WIP) 
description: A WIP implementation of StealthBlock for MV2 in Chromium
---

## Limitations in StealthBlock filter lists

In MV3, we are considerably more limited regarding media streams when it comes to the StealthBlock. This will be attempted to be mitigated by using emulation by default.

## Limitations in (unsafe) Adguard/uBlock filter lists

The filter lists will be converted into dynamic filter lists (if possible), but if it can't or the filter list limit is reached, it will overflow into using sandboxing. Still, if that can't, it will overflow into using `webRequest` from MV2 polyfills for [MV2 polyfills for MV3](https://github.com/Browser-Ports/MV2-Polyfills-for-MV3).
