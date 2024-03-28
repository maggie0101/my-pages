// The beauty of using TypeScript on both ends of the application is that we can
// share types between the client and the server very easily. This is a great way
// to keep the client and server in sync and avoid bugs. JavaScript makes you move
// fast, but TypeScript makes you move fast and not break things.

// A "type" can be defined with the `type` keyword or the `interface` keyword.
// They may seem similar, but there are some differences. For more information,
// see: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces
// A general rule of thumb is to always use `type` unless you have a good reason
// to use `interface`. `interface` is more powerful, at the cost of baring more
// footguns.
export type SongData = {
  id: string;
  song_name: string;
  singer: string;
  link: string;
  list_id: string;
};

export type ListData = {
  id: string;
  list_name: string;
  description: string
  songs: SongData[];
};

export type GetSongsResponse = SongData[];

export type GetSongResponse = SongData;

// Types can also be derived from other types using utility types. These are
// a few examples of utility types:
// for more information, see: https://www.typescriptlang.org/docs/handbook/utility-types.html
// You don't need to memorize these, but it's good to know they exist.
export type CreateSongPayload = Omit<SongData, "id">;
  

export type CreateSongResponse = Pick<SongData, "id">;

export type UpdateSongPayload = Partial<Omit<SongData, "id">>;

export type UpdateSongResponse = "OK";

export type DeleteSongResponse = "OK";

export type GetListsResponse = Omit<ListData, "songs">[];

export type CreateListPayload = Omit<ListData, "id" >;

export type CreateListResponse = Pick<ListData, "id">;

export type UpdateListPayload = Partial<Omit<ListData, "id" | "songs">>;

export type UpdateListResponse = "OK";

export type DeleteListResponse = "OK";
