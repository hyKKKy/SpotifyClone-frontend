import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@shared/lib/app-context';
import EndpointHero from '@shared/ui/EndpointHero';

function getPreviewKind(path) {
  const lowerPath = path.toLowerCase();

  if (/\.(png|jpg|jpeg|gif|webp)$/.test(lowerPath)) {
    return 'image';
  }

  if (/\.(mp3|wav|flac)$/.test(lowerPath)) {
    return 'audio';
  }

  return 'file';
}

export default function StorageUploadPage() {
  const { request, resolveBackendUrl } = useAppContext();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setError('');
    setUploadResult(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(form);
      const payload = await request('/storage/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadResult(payload);
      form.reset();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewKind = uploadResult?.url ? getPreviewKind(uploadResult.url) : null;

  return (
    <section className="page-shell">
      <EndpointHero
        description="Upload any file the storage controller accepts, then jump straight into the item preview route using the returned file id."
        endpoint="/storage/upload"
        method="POST"
        title="Upload to storage"
      >
        <p className="eyebrow">Controller contract</p>
        <p>The backend expects a single multipart field named `file`.</p>
      </EndpointHero>

      {error ? <div className="status-banner status-banner--error">{error}</div> : null}

      <div className="panel-grid">
        <form className="surface-card form-panel form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="storage-file">Choose file</label>
            <input id="storage-file" name="file" required type="file" />
          </div>

          <div className="button-row">
            <button className="button button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Uploading...' : 'Upload file'}
            </button>
          </div>
        </form>

        <article className="surface-card result-panel">
          <p className="eyebrow">Latest response</p>
          {uploadResult ? (
            <div className="preview-panel">
              <dl className="detail-list">
                <div>
                  <dt>File id</dt>
                  <dd>{uploadResult.file}</dd>
                </div>
                <div>
                  <dt>URL</dt>
                  <dd>{uploadResult.url}</dd>
                </div>
              </dl>

              <div className="preview-frame">
                {previewKind === 'image' ? (
                  <img alt={uploadResult.file} src={resolveBackendUrl(uploadResult.url)} />
                ) : null}
                {previewKind === 'audio' ? (
                  <audio controls src={resolveBackendUrl(uploadResult.url)} />
                ) : null}
                {previewKind === 'file' ? (
                  <a href={resolveBackendUrl(uploadResult.url)} rel="noreferrer" target="_blank">
                    Open uploaded file
                  </a>
                ) : null}
              </div>

              <div className="button-row">
                <Link className="button button-secondary" to={`/storage/item/${uploadResult.file}`}>
                  Open storage item page
                </Link>
              </div>
            </div>
          ) : (
            <p className="empty-state">Upload a file to inspect the returned id and preview it here.</p>
          )}
        </article>
      </div>
    </section>
  );
}
