---
title: Dev Tips
description: Dev Tips for making your own filter list for StealthBlock
---

- Making the asset a transparent equivalent with `concealResource` is the best option, and maybe modifying the styles of the DOM is the best (perhaps they have a frame around that same asset we just concealed), but if that can't be done, your next best bet would be to modify the elements, where whenever you change something the scripts would have no way of detecting that such a thing happened because the Elements you get to modify will be wrapped by AeroSandbox's Faker APIs.
