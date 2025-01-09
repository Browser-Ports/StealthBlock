---
title: StealthSpec Specs
---

All of the StealthSpec implementations will support traditional fitler lists (AdGuard, uBlock). When a traditional filter list is imported, the user will be warned that adding the filter list may lead to site detection of the adblocker before installing. If there are overlapping rules, the filter list types will have this precedence over every matched rule: StealthSpec Full > StealthSpec Lite -> traditional filter lists. The user will also be able to configure excludes for each filter list. Additionally, if there are any unsafe overrides the user will be warned about them and for which matches they apply to before installing.
