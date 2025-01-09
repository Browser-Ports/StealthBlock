# StealthBlock Spec

One of the main philosophies of StealhBlock is to not solve Ad Detection by tampering with Ad Block killer scripts, remember, they want us to target them, because they want to continue a cat and mouse game where the user of the Adblock extension may try to use the extension one day on a site and it would work fine and then it won't another. By design, there isn't much you can do to stop these scripts from working, but you can target the problem at the source and either make the asset invisible or delete it and pretend it doesn't exist with the faker APIs. There's no limitations to how StealthBlock works, it just forces you to do things the proper way.

Making the asset a transparent equivalent with `concealResource` is the best option, and maybe modifying the styles of the DOM is the best (perhaps they have a frame around that same asset we just concealed), but if that can't be done, your next best bet would be to modify the elements, where whenever you change something the scripts would have no way of detecting that such a thing happened because the Elements you get to modify will be wrapped by AeroSandbox's Faker APIs.

Instead of blocking things by restricting requests and responses, the resources must be specifically targetted for what they are.

I recommend using StealthBlock filter lists for sites that try to detect use of Adblock.

There is no other type of filter list that is undetectable by design.

StealthBlock makes use of API Interceptors in AeroSandbox, so you can make your own, but you are limited in that the scope of the proxy handlers you write make it so that you can't send any network requests. With the fetch/XHR interceptors, you could potentially escape, but you aren't allowed to change the request URL of the fetch unless you have the permission granted to do so

## Doesn't this seem to be bloated compared to simple request blocking?