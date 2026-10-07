import { Route, Routes } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import HotelPage from '@/pages/HotelPage';
import { PrivacyPage, TermsPage } from '@/pages/LegalPages';
import NotFoundPage from '@/pages/NotFoundPage';
import RoomDetailPage from '@/pages/RoomDetailPage';
import RoomsPage from '@/pages/RoomsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="o-hotel" element={<HotelPage />} />
        <Route path="acomodacoes" element={<RoomsPage />} />
        <Route path="acomodacoes/:slug" element={<RoomDetailPage />} />
        <Route path="politica-de-privacidade" element={<PrivacyPage />} />
        <Route path="termos-de-uso" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
