The way wizard works is we have individual wizard modals that are ready to display
whenever their "id" is registered for viewing (see Redux/wizard).

I've created 2 examples: Vendor and Product.

Vendor comes up at launch and relies on the middleware isVendor redux state to
determine if it should display or not (see Views/Portfolio). This will only come 
up once until you actually register. The mock registration will save your vendor 
info in the local indexedDB in the browser. To clear it out, go to devtools console,
under "Application" tab, expand left-menu indexedDB, and look for ald-1-vendor (note 
that the #1 might be 3, or 4 depending on which metamask network you have selected).
Once you expand that database, click "keyvaluepairs" in the expanded menu and it should
show you the vendor entry saved. To remove, click the row in the righthand table and
click the small 'x' next to the search bar at the top. Refresh the browser and the
modal should appear again for vendor registration.

Product comes up if you hit the "Add Product" button in the Portfolio main view. It will just 
keep adding to the view so that will need to be cleaned up with the card view that you had 
in mind, with scrolling, etc.

This should give you enough to keep going with the UI mods. I can wire in the middleware
stuff when you get further along.