import { FC } from 'react';
import { Pagination } from '@mui/material';
import { usePostsController } from './usePostsController';

export const PostsFeed: FC = () => {
  const {
    isLoading,
    posts,
    search,
    loadMoreTriggerRef,
    loadMoreTriggerIndex,
    totalPages,
    page,
    onPageChange
  } = usePostsController();

  return (
    <div>
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === loadMoreTriggerIndex ? loadMoreTriggerRef : undefined}
        >
          {post.title}
        </div>
      ))}

      {isLoading && <div>Loading…</div>}

      {search && (
        <Pagination count={totalPages} page={page} onChange={onPageChange} />
      )}
    </div>
  );
};
