import { useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  usePostsLazyQuery,
  usePostSearchLazyQuery,
  useStarredPostsQuery,
  useProfile,
  useQueryParams
} from './mockQueries';
import { Paginate } from './paginate';
import { useInfiniteScrollTrigger } from './useInfiniteScrollTrigger';

const PAGE_SIZE = 10;

export function usePostsController() {
  const history = useHistory();
  const { page: pageParam, offset: offsetParam, search } = useQueryParams(history.location.search);
  const offset = offsetParam ? Number(offsetParam) : 0;
  const page = pageParam ? Number(pageParam) : 1;
  const userId = useProfile().id;
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  const { data: starredData } = useStarredPostsQuery({
    variables: { userId },
    skip: !userId
  });

  const [getPosts, { loading: isLoadingFeed, data: feedData, fetchMore }] = usePostsLazyQuery({
    variables: { offset, limit: PAGE_SIZE }
  });
  const [searchPosts, { loading: isLoadingSearch, data: searchData }] = usePostSearchLazyQuery();

  const isLoading = isLoadingFeed || isLoadingSearch;
  const starredPosts = starredData?.user?.starredPosts ?? [];

  // Picks whichever result set is currently relevant: the paged feed, or
  // search results, without the view needing to know which query is active.
  const { totalPages, posts } = useMemo(() => {
    if (search) {
      return {
        totalPages: searchData?.postSearch?.totalPages ?? 0,
        posts: searchData?.postSearch?.list ?? []
      };
    }
    return {
      totalPages: feedData?.posts?.totalPages ?? 0,
      posts: feedData?.posts?.list ?? []
    };
  }, [feedData, searchData, search]);

  useEffect(() => {
    if (search) {
      searchPosts({ variables: { value: search, offset, limit: PAGE_SIZE } });
    } else {
      getPosts();
    }
  }, [search, page, offset, getPosts, searchPosts]);

  // Trigger the next page load a few items before the actual end of the
  // list, so the next batch is loading before the user hits the bottom.
  const loadMoreTriggerIndex = posts.length >= 3 ? posts.length - 3 : posts.length - 1;

  // Infinite scroll only applies to the main feed — search results are
  // paged explicitly via the MUI pagination control instead.
  useInfiniteScrollTrigger(loadMoreTriggerRef, () => {
    if (!search) {
      fetchMore({ variables: { offset: posts.length } });
    }
  });

  const onPageChange = (_event: unknown, nextPage: number) => {
    Paginate.onChangePage({ page: nextPage, limit: PAGE_SIZE, history, searchValue: search });
  };

  return {
    isLoading,
    posts,
    starredPosts,
    search,
    loadMoreTriggerRef,
    loadMoreTriggerIndex,
    totalPages,
    page,
    onPageChange
  };
}
