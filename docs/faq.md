# FAQ

## Can I run my own instance?

Yes! We host a public canonical version of the Matrix Public Archive at
[matrix-archive.evulid.cc](https://matrix-archive.evulid.cc/) that everyone can use but feel free to
also run your own instance (setup instructions in the [readme](../README.md)).

## How is this different from [`view.matrix.org`](https://view.matrix.org/)?

https://view.matrix.org/ (https://github.com/matrix-org/matrix-static) already existed
before the Matrix Public Archive but there was some desire to make something with more
Element-feeling polish and loading faster (avoid the slow 502's errors that are frequent
on `view.matrix.org`).

And with the introduction of the jump to date API via
[MSC3030](https://github.com/matrix-org/matrix-spec-proposals/pull/3030), we could show
messages from any given date and day-by-day navigation.

## Why did the archive bot join my room?

Only Matrix rooms with `world_readable` [history
visibility](https://spec.matrix.org/latest/client-server-api/#room-history-visibility)
are accessible in the Matrix Public Archive and indexed by search engines.

But the archive bot (`@archive:matrix.org`) will join any public room because it doesn't
know the history visibility without first joining. Any room that doesn't have
`world_readable` history visibility will lead a `403 Forbidden`.

The Matrix Public Archive doesn't hold onto any data (it's
stateless) and requests the messages from the homeserver every time. The
[matrix-archive.evulid.cc](https://matrix-archive.evulid.cc/) instance has some caching in place, 5
minutes for the current day, and 2 days for past content.

See the [opt out
section](#how-do-i-opt-out-and-keep-my-room-from-being-indexed-by-search-engines) below
for more details.

## Technical details

The main readme has a [technical overview](../README.md#technical-overview) of the
project. Here are a few more details.

### How do I figure out what version of the Matrix Public Archive is running?

Just visit the `/health-check` endpoint which will return information like the following:

```
{
  "ok": true,
  "commit": "954b22995a44bf11bfcd5850b62e206e46ee2db9",
  "version": "main",
  "versionDate": "2023-04-05T09:26:12.524Z",
  "packageVersion": "0.0.0"
}
```

### How does the archive room URL relate to what is displayed on the page?

We start the end of the date/time specified in the URL looking backward up to the limit.

### Why does the time selector only appear for some pages?

The time selector only appears for pages that have a lot of messages on a given
day/hour/minute/second (more than the configured `archiveMessageLimit`).
