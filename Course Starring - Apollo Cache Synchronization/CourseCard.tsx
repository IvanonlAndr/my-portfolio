import { FC } from 'react';
import { useStarredCourse } from './useStarredCourse';

interface CourseCardProps {
  courseId: string;
  title: string;
}

export const CourseCard: FC<CourseCardProps> = ({ courseId, title }) => {
  const { toggleStar, loading } = useStarredCourse(courseId);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{title}</span>
      <button onClick={toggleStar} disabled={loading} aria-label="Star course">
        ★
      </button>
    </div>
  );
};
