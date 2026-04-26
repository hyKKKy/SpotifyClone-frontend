import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import EndpointHero from '../../shared/ui/EndpointHero';

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

export default function StorageItemPage() {
  const { resolveBackendUrl } = useContext(AppContext);
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(itemId || '');

  useEffect(() => {
    setInputValue(itemId || '');
  }, [itemId]);

  const resolvedPath = useMemo(() => {
    if (!itemId) {
      return '';
    }

    return `/storage/item/${itemId}`;
  }, [itemId]);

  const previewKind = resolvedPath ? getPreviewKind(resolvedPath) : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      return;
    }

    navigate(`/storage/item/${encodeURIComponent(trimmedValue)}`);
  };

  return (
    <section className="page-shell">
      <EndpointHero
        description="Paste a stored filename and the page will build the `storage/item/{id}` route so you can preview images, audio, or generic files."
        endpoint="/storage/item/{id}"
        method="GET"
        title="Preview storage item"
      >
        <p className="eyebrow">Current item</p>
        <h3>{itemId || 'No file id selected yet'}</h3>
        <p>{itemId ? 'Preview is generated directly from the backend file endpoint.' : 'Enter a file id to start previewing.'}</p>
      </EndpointHero>

      <form className="surface-card form-panel" onSubmit={handleSubmit}>
        <div className="search-row">
          <div className="field">
            <label htmlFor="storage-item-id">File id</label>
            <input
              id="storage-item-id"
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="a1b2c3d4-cover.jpg"
              type="text"
              value={inputValue}
            />
          </div>

          <div className="button-row">
            <button className="button button-primary" type="submit">
              Load item
            </button>
          </div>
        </div>
      </form>

      <article className="surface-card preview-panel">
        <p className="eyebrow">Preview</p>
        {resolvedPath ? (
          <>
            <p className="response-code">{resolvedPath}</p>
            <div className="preview-frame">
              {previewKind === 'image' ? <img alt={itemId} src={resolveBackendUrl(resolvedPath)} /> : null}
              {previewKind === 'audio' ? <audio controls src={resolveBackendUrl(resolvedPath)} /> : null}
              {previewKind === 'file' ? (
                <a href={resolveBackendUrl(resolvedPath)} rel="noreferrer" target="_blank">
                  Open file in a new tab
                </a>
              ) : null}
            </div>
          </>
        ) : (
          <p className="empty-state">A storage preview appears here once you load an item id.</p>
        )}
      </article>
    </section>
  );
}
