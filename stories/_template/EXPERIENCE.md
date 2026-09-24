# Experience package contract (version 1)

Put `experience.json` in `stories/<storyId>/`. Shared runtime loads the session's storyId; no story-name branching or fixed act count.

- `version`: 1.
- `title`: display title.
- `steps`: ordered definitions, first is initial. Each has stable `id`, `type` (`title`, `questionnaire`, `placeholder`, `exploration`), optional `label`, `text`, `phoneText`, `next` (another step ID), `button`.
- A step's optional `durationSeconds` starts when it is entered. Before expiry its next button is unavailable. At expiry, show `expiredText` and wait for the host's next action; do not automatically advance. Media stops at expiry.
- `questionnaire`: `intro`, `savedText`, `fields`. Each field has `id`, `label`, `options` of `{value,label}`, optional `valueType: "number"`. Saved to the participant's questionnaire record. Existing answers count as completed. During a questionnaire phase, late submission remains possible until the host advances.
- Optional `map`: `image` (package asset path), `width`, `height`, and `rooms`: arrays `[stableId,defaultName,xPercent,yPercent,widthPercent,heightPercent]`. Map geometry/content belong to the package. Shared TV has no fixed room count.

Runtime session state: `games/<id>/state/experience = {stepId,startedAt}`. Transition uses a Firebase transaction and server timestamp. Clients derive remaining time from shared start time plus configured duration, adjusted using Firebase server clock offset. No decrementing client timer is persisted. Refresh/reconnect does not reset the deadline. Expiry is derived even if no host browser remains open.

Legacy player pages bridge to player-flow.html only for games with a version-1 package. No package means their legacy route remains. My games uses `?stay=1` so a player can switch sessions.

The Thoreson package currently ends in an Act 2 placeholder. It does not generate roles, reveal clues, or invent Act 2 gameplay. Existing character selection, waiver, role assignment, and other legacy story script formats remain separate work. Existing game database permissions have not been redesigned in this update.
