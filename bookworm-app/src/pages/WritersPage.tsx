import { useParams } from 'react-router-dom';
import { PageLayout, PageMessage, WritersTemplate } from '../components/templates';
import { useAsync } from '../hooks/useAsync';
import { catalogService, errorMessage } from '../services';

/** Serves both /writers (all writers) and /author/:id (a single writer). */
export function WritersPage() {
  const { id } = useParams<{ id: string }>();
  const authors = useAsync(() => catalogService.listAuthors(), []);

  if (!authors.data) {
    return (
      <PageLayout>
        <PageMessage loading={authors.loading}>{authors.error ? errorMessage(authors.error) : 'Loading writers…'}</PageMessage>
      </PageLayout>
    );
  }
  return (
    <PageLayout>
      <WritersTemplate authors={authors.data} selectedId={id} />
    </PageLayout>
  );
}
