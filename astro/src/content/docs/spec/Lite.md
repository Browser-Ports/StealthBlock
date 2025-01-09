---
title: StealthBlock Lite Spec
--- 

This is compatible with the AdGuard Filter List format except for things that can lead to detection. It removes features that can only lead to detection, and it adds features in the form of comments so that the filter lists can be backwards-compatible for use in other Adblockers.

This is only useful for simple things and the [Full spec](./Full.md) is recommended for most use cases.

Has:

- [Cosmetic Rules](https://adguard.com/kb/general/ad-filtering/create-own-filters/#cosmetic-rule): Your CSS Rules will be faked using [AeroSandbox](https://github.com/vortexdl/aero/tree/untested/AeroSandbox)'s Faker APIs. There is no way to override this, and it should not impair the user experience.

- All of the same [Basic Rules](https://adguard.com/kb/general/ad-filtering/create-own-filters/#basic-rules-syntax), except they must contain a [content-type modifier](https://adguard.com/kb/general/ad-filtering/create-own-filters/#content-type-modifiers), and it can only contain the content-type modifiers that have to do with media (instead of blocking, it will conceal it with sandboxing):
    - `$font`
    - `$image`
    - `$media`
    - `$stylesheet` - this one is unique, because it will delete them with Faker

# Pre-parsing directives

- **You must have** `!# TYPE=STEALTHBLOCK_LITE`, or else the script will be interpreted as a normal Adblock
- You can add `!# CONCEAL_JS_API=TRUE` to any rule with a content-type modifier that the spec permits, which will make it so that any attempts to get information about the asset (like the pixel data of an `Image` on an image tag that has been concealed) from JS would return what would've been returned if the asset was properly there.
> This is highly recommended!
- You can add `!# UNSAFE_DISABLE_TRANSPARENCY`: By default, unlike traditional filter list types, when a rule is for an `$image` or `$media` that can be transparent, it is redirected to a transparent equivalent. While backwards compatibility is important, it's more important to evade detection.   
You can also add `!# REDIRECT_ASSET_URL=<STRING>`, which will change the default asset URL, which is normally tiny and transparent. This only works on `$image` and `$media`, but it only works on `$media` that is HVEC or VP9 ([the only formats that support alpha channels](https://rotato.app/blog/transparent-videos-for-the-web)). It doesn't usually matter and we can typically override the asset with our own HEVC transparent video, but we can't do that in the case of chunks in media streams. These are the content type modifiers that can work with dynamic rules, and don't need sandboxing to power it until the rule limit is reached.

You can also add `!# MEDIA_STREAM_ONLY=TRUE`, which will make it so when `$media` is used it only blocks if it is a media stream.

# The flaws in this compared to [Full](./Full.md)

StealthBlock Lite, as it implies in the name, is more limited in functionality

- No ability to change requests or responses to prevent against invasive data collection  
- The ability to write supporitng JS code to skip ad segements in videos (important for sites like YouTube)
- No way block segements of media streams (yet)