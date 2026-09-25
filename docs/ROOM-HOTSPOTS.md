# Room artwork interactions

An optional `map.roomViews[roomId].hotspots` array replaces the room's top-level object list with artwork targets. Each entry has an `interactionId` and `rect: [left, top, width, height]` in percentages of the source artwork. Targets must reference unique, top-level interactions in that same room, and stay within 0–100 bounds.

The shared renderer matches the image's contain-fit letterboxing and responds to resizing. Buttons support keyboard focus and touch. Hover/focus reveals an inspection label; the voluntary highlight control reveals all available targets briefly. The object list remains available through a toggle, and automatically returns while inspecting contents. Rooms without hotspots retain their existing interface.

Targets invoke the existing inspection handler, preserving locked descriptions, inspected state, phone action requests, child discovery and inventory collection. Hidden objects remain filtered by existing discovery rules. This introduces no save migration or database permission changes.

The music room uses its existing piano and brass-horn cabinet artwork as the first authored targets. Detailed close-up artwork and visual open/collected variants are future additions; this pass connects the artwork to existing inspection panels.
