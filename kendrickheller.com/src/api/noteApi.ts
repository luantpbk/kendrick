import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { NoteType } from './models';

/************************************/
/********                    ********/
/******        Note         ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

export const useGetNote = () => {
  const fetch = useFetch();
  return useCallback(
    (functionId: number, objectId: number) => {
      return fetch({
        url: `pgcore/rest-api/note?functionId=${functionId}&objectId=${objectId}`,
        method: 'get',
      }) as Promise<NoteType[]>;
    },
    [fetch],
  );
};

export const usePostNote = () => {
  const fetch = useFetch();
  return useCallback(
    (note: NoteType, recordUserId: number) => {
      return fetch({
        url: `pgcore/rest-api/note?recordUserId=${recordUserId}`,
        method: 'post',
        data: note,
      }) as Promise<NoteType>;
    },
    [fetch],
  );
};

export const useDeleteNote = () => {
  const fetch = useFetch();
  return useCallback(
    (noteId: number) => {
      return fetch({
        url: `pgcore/rest-api/note/${noteId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of Note
