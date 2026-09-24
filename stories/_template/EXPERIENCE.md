# Experience authoring

The current contract is [STORY_PACKAGES.md](../../STORY_PACKAGES.md). Supported step types include title, questionnaire, placeholder, exploration and dialogue. Steps use stable IDs and explicit `next` links; an optional `autoAdvance` is handled by the connected host UI.

See [story-state architecture](../../docs/ARCHITECTURE.md) for persisted schema, revision and pause behavior. Story files define content and transitions, not Firebase permissions or account roles. The older opening-only description is retained under `review/legacy/stories/_template/EXPERIENCE.md` for historical review.
