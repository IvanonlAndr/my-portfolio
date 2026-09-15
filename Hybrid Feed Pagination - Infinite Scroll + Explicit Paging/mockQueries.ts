// Placeholders standing in for hooks that would normally be generated
// by GraphQL Code Generator from the schema.

export function usePostsLazyQuery(_options: { variables: { offset: number; limit: number } }) {
  return [
    () => {},
    {
      loading: false,
      data: { posts: { list: [] as { id: string; title: string }[], totalPages: 0 } },
      fetchMore: async (_args: { variables: { offset: number } }) => {}
    }
  ] as const;
}

export function usePostSearchLazyQuery() {
  return [
    (_args: { variables: { value: string; offset: number; limit: number } }) => {},
    { loading: false, data: { postSearch: { list: [] as { id: string; title: string }[], totalPages: 0 } } }
  ] as const;
}

export function useStarredPostsQuery(_options: { variables: { userId: string }; skip: boolean }) {
  return { data: { user: { starredPosts: [] as string[] } } };
}

export function useProfile() {
  return { id: 'user-1' };
}

export function useQueryParams(search: string) {
  const params = new URLSearchParams(search);
  return {
    page: params.get('page'),
    offset: params.get('offset'),
    search: params.get('search')
  };
}
