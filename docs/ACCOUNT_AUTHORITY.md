# Account authority and rollout

Platform administrator, party host, and story character are separate concepts. A character's role must never confer account privileges. A party host owns one game; a platform administrator manages platform records. Being an administrator does not make an account the host of somebody else's session.

## Implemented boundary

`platformAdmins/<uid> === true` is the administrator grant used by RTDB rules and the account capability lookup. All browser writes to this registry are denied, including writes by administrators. Trusted project tooling provisions and revokes grants. Revocation changes database access immediately without waiting for an Auth token refresh.

`users/<uid>/role` remains legacy profile metadata for compatibility. Existing values are not trusted. Ordinary users cannot set their profile role to `admin`; editing a display name still works. Neither invitations nor writing another profile field grants authority. The old self-service admin registration and invite-generation flow has been retired; regular registration and game invitations continue to work.

Only the game creator may change the existing session's story progression or delete the game. The check compares progression fields at the game boundary, so removing the entire state cannot bypass a child validation rule. Party members can still perform existing non-progression interactions. These rules do **not** yet validate every puzzle command or isolate all private game data.

## Provisioning without a paid server

Use a trusted Firebase CLI login with project administration rights. No credentials are stored in the repository or sent to collaborators. The tool resolves the database through the selected project's API, looks up an existing Auth identity, and requires an enabled, email-verified account when granting access. It currently expects one active RTDB instance per project and stops if that is ambiguous.

Dry run first:

```
node scripts/admin-access.cjs --project YOUR_PROJECT --email owner@example.com --grant
```

After checking the printed project, email and UID, repeat with `--apply`. Use `--revoke` instead of `--grant` to remove access; `--uid` can replace `--email`. Revocation may target an unverified/disabled account. Applied changes include an audit entry in `platformAdminAudit`. The tool defaults to no writes. Existing grants can be checked with:

```
node scripts/admin-access.cjs --project YOUR_PROJECT --check
```

The local Player Lab seeds its test host grant using the emulator's privileged seed connection. Other simulated players get no administrator grant. The rules tests run in disposable namespaces and exercise denied requests directly, rather than relying on hidden UI controls.

## Release sequence

1. Review the intended owner accounts manually. **Do not migrate every profile marked `admin`**; that field was user-editable.
2. The intended owner signs in to the target project once and verifies their email. Grant that exact account through the trusted tool. Development and production have separate Auth identities and require separate provisioning.
3. Run the rules/browser suite, deploy the new rules and UI together through the reviewed release process, and verify authorized management plus ordinary guest play.
4. Check revocation and retain the audit history. Existing legacy invite records can remain for reference; they no longer confer access and are readable only by trusted administrators.

The production release workflow fails before deployment if no trusted administrator exists. A new shared-development project can still run ordinary test games without an administrator; sign in and provision its owner before testing platform administration. No live grants or production rules were changed by this code migration.

Rollback must retain the trusted-registry rules. Restoring older role-based rules would reopen privilege escalation. Keep an operator CLI account able to recover grants if all grants are accidentally revoked.

## Remaining security work

Game reads are still broadly granted in the production prototype, and non-progression game writes remain too broad. Private player data, join authorization, puzzle reward validation, party-code index ownership and photo-storage rules need separate migrations. Do not describe this change as complete production hardening or use the prototype for customer secrets. A separate data projection and command boundary are needed before removing legacy whole-game listeners safely.
