import { Route, Routes } from 'react-router-dom';
import AddAlbumPage from '../pages/api/AddAlbumPage';
import AddTrackPage from '../pages/api/AddTrackPage';
import AlbumDetailPage from '../pages/api/AlbumDetailPage';
import AlbumsPage from '../pages/api/AlbumsPage';
import LoginPage from '../pages/api/LoginPage';
import LogoutPage from '../pages/api/LogoutPage';
import SignupPage from '../pages/api/SignupPage';
import StorageItemPage from '../pages/api/StorageItemPage';
import StorageUploadPage from '../pages/api/StorageUploadPage';
import TracksPage from '../pages/api/TracksPage';
import AdminPanel from '../pages/adminPanel/AdminPanel';
import Home from '../pages/home/Home';
import ArtistDetailPage from '../pages/library/ArtistDetailPage';
import ArtistsPage from '../pages/library/ArtistsPage';
import LibraryPage from '../pages/library/LibraryPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SearchPage from '../pages/search/SearchPage';
import NotFoundPage from '../pages/status/NotFoundPage';
import AdminOnlyRoute from '../shared/ui/AdminOnlyRoute';
import Layout from '../widgets/layout/Layout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<LibraryPage />} />
        <Route path="albums" element={<AlbumsPage />} />
        <Route path="tracks" element={<TracksPage />} />
        <Route path="artists" element={<ArtistsPage />} />
        <Route path="artists/:artistId" element={<ArtistDetailPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="studio"
          element={
            <AdminOnlyRoute>
              <AdminPanel />
            </AdminOnlyRoute>
          }
        />
        <Route
          path="admin"
          element={
            <AdminOnlyRoute>
              <AdminPanel />
            </AdminOnlyRoute>
          }
        />
        <Route
          path="albums/add"
          element={
            <AdminOnlyRoute>
              <AddAlbumPage />
            </AdminOnlyRoute>
          }
        />
        <Route
          path="albums/:albumId/edit"
          element={
            <AdminOnlyRoute>
              <AddAlbumPage />
            </AdminOnlyRoute>
          }
        />
        <Route path="albums/:albumId" element={<AlbumDetailPage />} />
        <Route
          path="tracks/add"
          element={
            <AdminOnlyRoute>
              <AddTrackPage />
            </AdminOnlyRoute>
          }
        />
        <Route
          path="tracks/:trackId/edit"
          element={
            <AdminOnlyRoute>
              <AddTrackPage />
            </AdminOnlyRoute>
          }
        />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/signup" element={<SignupPage />} />
        <Route path="auth/logout" element={<LogoutPage />} />
        <Route
          path="storage/upload"
          element={
            <AdminOnlyRoute>
              <StorageUploadPage />
            </AdminOnlyRoute>
          }
        />
        <Route path="storage/item" element={<StorageItemPage />} />
        <Route path="storage/item/:itemId" element={<StorageItemPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
