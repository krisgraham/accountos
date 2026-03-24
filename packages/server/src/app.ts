import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health-routes';
import { organizationRouter } from './routes/organization-routes';
import { contactRouter } from './routes/contact-routes';
import { departmentRouter } from './routes/department-routes';
import { projectRouter } from './routes/project-routes';
import { communicationRouter } from './routes/communication-routes';
import { meetingNoteRouter } from './routes/meeting-note-routes';
import { teamMemberRouter } from './routes/team-member-routes';
import { dashboardRouter } from './routes/dashboard-routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api', organizationRouter);
app.use('/api', contactRouter);
app.use('/api', departmentRouter);
app.use('/api', projectRouter);
app.use('/api', communicationRouter);
app.use('/api', meetingNoteRouter);
app.use('/api', teamMemberRouter);
app.use('/api', dashboardRouter);

export { app };
