import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { AccountsPage } from './pages/AccountsPage';
import { AccountDetailPage } from './pages/AccountDetailPage';
import { ContactsPage } from './pages/ContactsPage';
import { ContactDetailPage } from './pages/ContactDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { CommunicationsPage } from './pages/CommunicationsPage';
import { MeetingNotesPage } from './pages/MeetingNotesPage';
import { OrgChartPage } from './pages/OrgChartPage';
import { DepartmentDetailPage } from './pages/DepartmentDetailPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/:id" element={<AccountDetailPage />} />
          <Route path="/accounts/:id/org-chart" element={<OrgChartPage />} />
          <Route path="/accounts/:id/departments/:deptId" element={<DepartmentDetailPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contacts/:id" element={<ContactDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/communications" element={<CommunicationsPage />} />
          <Route path="/meeting-notes" element={<MeetingNotesPage />} />
          <Route path="/meeting-notes/new" element={<MeetingNotesPage />} />
          <Route path="/meeting-notes/:id" element={<MeetingNotesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
