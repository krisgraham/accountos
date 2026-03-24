import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helper: date N days ago (negative = N days from now)
// ---------------------------------------------------------------------------
function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
async function main() {
  console.log('Seeding database...');

  // =========================================================================
  // 0. CLEAR EXISTING DATA (reverse dependency order)
  // =========================================================================
  console.log('Clearing existing data...');
  await prisma.link.deleteMany();
  await prisma.nextStep.deleteMany();
  await prisma.engagementStrategy.deleteMany();
  await prisma.relationshipIntel.deleteMany();
  await prisma.desire.deleteMany();
  await prisma.teamAffinity.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.actionItem.deleteMany();
  await prisma.personNote.deleteMany();
  await prisma.meetingAttendee.deleteMany();
  await prisma.meetingNote.deleteMany();
  await prisma.communicationProject.deleteMany();
  await prisma.communicationParticipant.deleteMany();
  await prisma.communication.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.department.deleteMany();
  await prisma.organization.deleteMany();
  console.log('Existing data cleared.');

  // =========================================================================
  // 1. ORGANIZATIONS
  // =========================================================================
  console.log('Creating organizations...');
  const acme = await prisma.organization.create({
    data: {
      name: 'Acme Corp',
      industry: 'Technology',
      website: 'https://acmecorp.example.com',
      description:
        'Enterprise technology company with 5,000+ employees specializing in cloud infrastructure and developer tools.',
      healthScore: 72,
      healthStatus: 'HEALTHY',
    },
  });

  const globaltech = await prisma.organization.create({
    data: {
      name: 'GlobalTech Inc',
      industry: 'SaaS',
      website: 'https://globaltech.example.com',
      description:
        'Mid-market SaaS company with 800 employees focused on business process automation.',
      healthScore: 45,
      healthStatus: 'MONITOR',
    },
  });

  console.log(`  Created: ${acme.name}, ${globaltech.name}`);

  // =========================================================================
  // 2. DEPARTMENTS
  // =========================================================================
  console.log('Creating departments...');

  // Acme departments
  const acmeEng = await prisma.department.create({
    data: {
      name: 'Engineering',
      colorCode: '#4f8ff7',
      missionFocus: 'Build and maintain core platform',
      strategicPriorities: 'Cloud-native migration, API platform, developer experience',
      keyInitiatives: 'Kubernetes migration, API gateway rollout, CI/CD modernization',
      organizationId: acme.id,
    },
  });

  const acmeProduct = await prisma.department.create({
    data: {
      name: 'Product',
      colorCode: '#8b5cf6',
      missionFocus: 'Define product strategy and roadmap',
      strategicPriorities: 'AI integration, customer-led growth, platform consolidation',
      keyInitiatives: 'AI copilot feature, unified dashboard, self-service onboarding',
      organizationId: acme.id,
    },
  });

  const acmeIT = await prisma.department.create({
    data: {
      name: 'IT Infrastructure',
      colorCode: '#06b6d4',
      missionFocus: 'Enterprise infrastructure and security',
      strategicPriorities: 'Zero-trust architecture, cloud cost optimization, compliance',
      keyInitiatives: 'SOC2 Type II audit, multi-cloud strategy, identity management upgrade',
      organizationId: acme.id,
    },
  });

  const acmeFinance = await prisma.department.create({
    data: {
      name: 'Finance',
      colorCode: '#f59e0b',
      missionFocus: 'Financial planning and procurement',
      strategicPriorities: 'Vendor consolidation, cost reduction, budget transparency',
      keyInitiatives: 'Procurement portal rollout, vendor risk assessment, FP&A modernization',
      organizationId: acme.id,
    },
  });

  const acmeExec = await prisma.department.create({
    data: {
      name: 'Executive',
      colorCode: '#ec4899',
      missionFocus: 'Corporate strategy and governance',
      strategicPriorities: 'Digital transformation, M&A integration, market expansion',
      keyInitiatives: 'Board digital strategy review, innovation lab launch',
      organizationId: acme.id,
    },
  });

  // GlobalTech departments
  const gtEng = await prisma.department.create({
    data: {
      name: 'Engineering',
      colorCode: '#4f8ff7',
      missionFocus: 'Platform development and reliability',
      organizationId: globaltech.id,
    },
  });

  const gtSales = await prisma.department.create({
    data: {
      name: 'Sales',
      colorCode: '#22c55e',
      missionFocus: 'Revenue growth and customer acquisition',
      organizationId: globaltech.id,
    },
  });

  const gtOps = await prisma.department.create({
    data: {
      name: 'Operations',
      colorCode: '#f97316',
      missionFocus: 'Operational excellence and customer success',
      organizationId: globaltech.id,
    },
  });

  console.log('  Created 8 departments across 2 organizations');

  // =========================================================================
  // 3. ACME CONTACTS (40+)
  // =========================================================================
  console.log('Creating Acme Corp contacts...');

  // --- Level 1: CEO ---
  const ceo = await prisma.contact.create({
    data: {
      name: 'Robert Chen',
      title: 'Chief Executive Officer',
      email: 'robert.chen@acmecorp.example.com',
      phone: '+1-555-100-0001',
      linkedinUrl: 'https://linkedin.com/in/robertchen',
      background:
        'Former McKinsey partner. Led three successful IPOs. Board member at two Fortune 500 companies. Stanford MBA.',
      stakeholderRole: 'EXECUTIVE_SPONSOR',
      sentiment: 'ADVOCATE',
      influenceLevel: 'HIGH',
      relationshipScore: 85,
      engagementStatus: 'NOT_YET_ENGAGED',
      engagementStatusNote: 'Introductory meeting still pending; outreach initiated through CTO\'s office but not yet confirmed.',
      isKeyStakeholder: true,
      ourGoals: 'Establish executive sponsorship for digital transformation. Position EPAM as strategic technology partner beyond staff augmentation.',
      organizationId: acme.id,
      departmentId: acmeExec.id,
    },
  });

  // --- Level 2: C-suite ---
  const cto = await prisma.contact.create({
    data: {
      name: 'Priya Patel',
      title: 'Chief Technology Officer',
      email: 'priya.patel@acmecorp.example.com',
      phone: '+1-555-100-0002',
      linkedinUrl: 'https://linkedin.com/in/priyapatel',
      background:
        'Ex-Google Distinguished Engineer. PhD CS from MIT. Published researcher in distributed systems. Joined Acme 3 years ago.',
      stakeholderRole: 'DECISION_MAKER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'HIGH',
      relationshipScore: 78,
      engagementStatus: 'OUTREACH_INITIATED',
      engagementStatusNote: 'Initial engagement through VP Engineering. Preparing executive briefing narrative.',
      isKeyStakeholder: true,
      ourGoals: 'Shift perception from vendor to trusted advisor. Secure sponsorship for cloud migration expansion. Build direct relationship (currently engaging through VPs).',
      organizationId: acme.id,
      departmentId: acmeExec.id,
      reportsToId: ceo.id,
    },
  });

  const cfo = await prisma.contact.create({
    data: {
      name: 'Michael Torres',
      title: 'Chief Financial Officer',
      email: 'michael.torres@acmecorp.example.com',
      phone: '+1-555-100-0003',
      linkedinUrl: 'https://linkedin.com/in/michaeltorres',
      background:
        'Former Deloitte audit partner. CPA, CFA. Focused on cost optimization and vendor consolidation. Known for being data-driven.',
      stakeholderRole: 'ECONOMIC_BUYER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'HIGH',
      relationshipScore: 35,
      engagementStatus: 'DORMANT',
      engagementStatusNote: 'Was engaged during initial procurement. Has gone silent since delivery escalation in Q4.',
      isKeyStakeholder: true,
      ourGoals: 'Re-engage after going dormant. Understand budget cycle timing for FY27 planning. Address any concerns from delivery escalation.',
      organizationId: acme.id,
      departmentId: acmeFinance.id,
      reportsToId: ceo.id,
    },
  });

  // --- Level 3: VPs ---
  const vpEng = await prisma.contact.create({
    data: {
      name: 'Jane Smith',
      title: 'VP Engineering',
      email: 'jane.smith@acmecorp.example.com',
      phone: '+1-555-100-0010',
      linkedinUrl: 'https://linkedin.com/in/janesmith',
      background:
        'Joined Acme from AWS. 15 years cloud infrastructure experience. Built Acme engineering team from 50 to 200. Our strongest internal champion.',
      stakeholderRole: 'CHAMPION',
      sentiment: 'ADVOCATE',
      influenceLevel: 'HIGH',
      relationshipScore: 92,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      isKeyStakeholder: true,
      ourGoals: 'Maintain champion status. Leverage for internal referrals to Finance and Product teams. Co-present at quarterly business reviews.',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: cto.id,
    },
  });

  const vpProduct = await prisma.contact.create({
    data: {
      name: 'Sarah Kim',
      title: 'VP Product',
      email: 'sarah.kim@acmecorp.example.com',
      phone: '+1-555-100-0011',
      linkedinUrl: 'https://linkedin.com/in/sarahkim',
      background:
        'Product leader with 12 years experience at Salesforce and Slack. Focused on AI-driven product features. Skeptical of vendors but fair.',
      stakeholderRole: 'INFLUENCER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 65,
      engagementStatus: 'RELATIONSHIP_BUILDING',
      organizationId: acme.id,
      departmentId: acmeProduct.id,
      reportsToId: cto.id,
    },
  });

  const vpIT = await prisma.contact.create({
    data: {
      name: 'David Washington',
      title: 'VP IT Infrastructure',
      email: 'david.washington@acmecorp.example.com',
      phone: '+1-555-100-0012',
      linkedinUrl: 'https://linkedin.com/in/davidwashington',
      background:
        'Enterprise infrastructure veteran. 20 years in IT ops. Risk-averse, prefers proven solutions. Very detail-oriented in vendor evaluations.',
      stakeholderRole: 'TECHNICAL_EVALUATOR',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 60,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeIT.id,
      reportsToId: cto.id,
    },
  });

  const dirFinance = await prisma.contact.create({
    data: {
      name: 'Karen Mitchell',
      title: 'Director of Finance',
      email: 'karen.mitchell@acmecorp.example.com',
      phone: '+1-555-100-0013',
      linkedinUrl: 'https://linkedin.com/in/karenmitchell',
      background:
        'Reports directly to CFO. Controls procurement approvals under $1M. Known to slow down vendor onboarding. Prefers annual contracts over multi-year.',
      stakeholderRole: 'GATEKEEPER',
      sentiment: 'RESISTANT',
      influenceLevel: 'MEDIUM',
      relationshipScore: 20,
      engagementStatus: 'NOT_YET_ENGAGED',
      organizationId: acme.id,
      departmentId: acmeFinance.id,
      reportsToId: cfo.id,
    },
  });

  // --- Level 4: Engineering Managers/Leads (8) ---
  const engMgr1 = await prisma.contact.create({
    data: {
      name: 'Alex Rivera',
      title: 'Engineering Manager - Platform',
      email: 'alex.rivera@acmecorp.example.com',
      phone: '+1-555-100-0020',
      background: 'Leads the platform team of 12 engineers. Kubernetes expert. Strong advocate for our cloud migration tools.',
      stakeholderRole: 'CHAMPION',
      sentiment: 'ADVOCATE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 88,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      isKeyStakeholder: true,
      ourGoals: 'Strengthen as internal advocate. Support their career advancement goals where possible.',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: vpEng.id,
    },
  });

  const engMgr2 = await prisma.contact.create({
    data: {
      name: 'Fatima Al-Rashid',
      title: 'Engineering Manager - Backend Services',
      email: 'fatima.alrashid@acmecorp.example.com',
      phone: '+1-555-100-0021',
      background: 'Manages backend microservices team. Deep expertise in Java and Go. Previously at Netflix.',
      stakeholderRole: 'TECHNICAL_EVALUATOR',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 72,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: vpEng.id,
    },
  });

  const engMgr3 = await prisma.contact.create({
    data: {
      name: 'Chris Nakamura',
      title: 'Engineering Manager - Frontend',
      email: 'chris.nakamura@acmecorp.example.com',
      phone: '+1-555-100-0022',
      background: 'Frontend architecture lead. React and TypeScript specialist. Passionate about developer experience.',
      stakeholderRole: 'INFLUENCER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'LOW',
      relationshipScore: 55,
      engagementStatus: 'RELATIONSHIP_BUILDING',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: vpEng.id,
    },
  });

  const engMgr4 = await prisma.contact.create({
    data: {
      name: 'Maria Santos',
      title: 'Engineering Manager - Data',
      email: 'maria.santos@acmecorp.example.com',
      phone: '+1-555-100-0023',
      background: 'Leads data engineering and analytics. PhD in data science from UC Berkeley. Building data lake infrastructure.',
      stakeholderRole: 'TECHNICAL_EVALUATOR',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 68,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: vpEng.id,
    },
  });

  const engMgr5 = await prisma.contact.create({
    data: {
      name: 'James O\'Brien',
      title: 'Engineering Manager - DevOps',
      email: 'james.obrien@acmecorp.example.com',
      phone: '+1-555-100-0024',
      background: 'DevOps and SRE lead. Drives CI/CD modernization. Key stakeholder for our managed services.',
      stakeholderRole: 'CHAMPION',
      sentiment: 'ADVOCATE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 80,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: vpEng.id,
    },
  });

  const engMgr6 = await prisma.contact.create({
    data: {
      name: 'Linda Chang',
      title: 'Engineering Manager - QA',
      email: 'linda.chang@acmecorp.example.com',
      phone: '+1-555-100-0025',
      background: 'Quality engineering lead. Driving shift-left testing strategy. Interested in AI-powered testing tools.',
      stakeholderRole: 'END_USER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 45,
      engagementStatus: 'INITIAL_CONTACT',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: vpEng.id,
    },
  });

  const engLead1 = await prisma.contact.create({
    data: {
      name: 'Ryan Park',
      title: 'Principal Engineer',
      email: 'ryan.park@acmecorp.example.com',
      phone: '+1-555-100-0026',
      background: 'Technical authority on architecture decisions. Reports to VP Eng on special projects. Highly respected across org.',
      stakeholderRole: 'TECHNICAL_EVALUATOR',
      sentiment: 'ADVOCATE',
      influenceLevel: 'HIGH',
      relationshipScore: 75,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: vpEng.id,
    },
  });

  const engLead2 = await prisma.contact.create({
    data: {
      name: 'Nina Kowalski',
      title: 'Staff Engineer - Security',
      email: 'nina.kowalski@acmecorp.example.com',
      phone: '+1-555-100-0027',
      background: 'Security engineering lead. CISSP certified. Drives security requirements for all vendor evaluations.',
      stakeholderRole: 'TECHNICAL_EVALUATOR',
      sentiment: 'NEUTRAL',
      influenceLevel: 'MEDIUM',
      relationshipScore: 50,
      engagementStatus: 'RELATIONSHIP_BUILDING',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: vpEng.id,
    },
  });

  // --- Product Managers (5) ---
  const pm1 = await prisma.contact.create({
    data: {
      name: 'Jessica Wu',
      title: 'Senior Product Manager - Platform',
      email: 'jessica.wu@acmecorp.example.com',
      background: 'Owns platform product roadmap. Works closely with engineering. Key contact for integration discussions.',
      stakeholderRole: 'INFLUENCER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 62,
      engagementStatus: 'RELATIONSHIP_BUILDING',
      organizationId: acme.id,
      departmentId: acmeProduct.id,
      reportsToId: vpProduct.id,
    },
  });

  const pm2 = await prisma.contact.create({
    data: {
      name: 'Tom Harris',
      title: 'Product Manager - AI/ML',
      email: 'tom.harris@acmecorp.example.com',
      background: 'Leading AI product initiatives. Former data scientist. Only contact we have on the AI Platform Assessment project.',
      stakeholderRole: 'INFLUENCER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 58,
      engagementStatus: 'INITIAL_CONTACT',
      organizationId: acme.id,
      departmentId: acmeProduct.id,
      reportsToId: vpProduct.id,
    },
  });

  const pm3 = await prisma.contact.create({
    data: {
      name: 'Rachel Lee',
      title: 'Product Manager - Enterprise',
      email: 'rachel.lee@acmecorp.example.com',
      background: 'Manages enterprise customer features. Strong requirements documentation skills.',
      stakeholderRole: 'END_USER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 40,
      engagementStatus: 'OUTREACH_INITIATED',
      organizationId: acme.id,
      departmentId: acmeProduct.id,
      reportsToId: vpProduct.id,
    },
  });

  const pm4 = await prisma.contact.create({
    data: {
      name: 'Daniel Okafor',
      title: 'Product Manager - Growth',
      email: 'daniel.okafor@acmecorp.example.com',
      background: 'Growth and onboarding product owner. Data-driven, runs frequent experiments.',
      stakeholderRole: 'END_USER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'LOW',
      relationshipScore: 38,
      engagementStatus: 'OUTREACH_INITIATED',
      organizationId: acme.id,
      departmentId: acmeProduct.id,
      reportsToId: vpProduct.id,
    },
  });

  const pm5 = await prisma.contact.create({
    data: {
      name: 'Amanda Reyes',
      title: 'Director of Product - Analytics',
      email: 'amanda.reyes@acmecorp.example.com',
      background: 'Senior product leader for analytics suite. Well-connected across the org. Could be a future champion.',
      stakeholderRole: 'INFLUENCER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'MEDIUM',
      relationshipScore: 48,
      engagementStatus: 'INITIAL_CONTACT',
      organizationId: acme.id,
      departmentId: acmeProduct.id,
      reportsToId: vpProduct.id,
    },
  });

  // --- IT Managers (4) ---
  const itMgr1 = await prisma.contact.create({
    data: {
      name: 'Brian Foster',
      title: 'IT Security Manager',
      email: 'brian.foster@acmecorp.example.com',
      background: 'Manages security operations and compliance. Key evaluator for managed security services.',
      stakeholderRole: 'TECHNICAL_EVALUATOR',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 64,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeIT.id,
      reportsToId: vpIT.id,
    },
  });

  const itMgr2 = await prisma.contact.create({
    data: {
      name: 'Wendy Zhao',
      title: 'IT Operations Manager',
      email: 'wendy.zhao@acmecorp.example.com',
      background: 'Day-to-day IT operations. Manages vendor relationships and SLAs. Practical and detail-oriented.',
      stakeholderRole: 'END_USER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'LOW',
      relationshipScore: 52,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeIT.id,
      reportsToId: vpIT.id,
    },
  });

  const itMgr3 = await prisma.contact.create({
    data: {
      name: 'Marcus Thompson',
      title: 'Cloud Infrastructure Manager',
      email: 'marcus.thompson@acmecorp.example.com',
      background: 'AWS and Azure certified. Manages cloud infrastructure team. Hands-on technical leader.',
      stakeholderRole: 'TECHNICAL_EVALUATOR',
      sentiment: 'ADVOCATE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 70,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeIT.id,
      reportsToId: vpIT.id,
    },
  });

  const itMgr4 = await prisma.contact.create({
    data: {
      name: 'Samantha Liu',
      title: 'Network Engineering Manager',
      email: 'samantha.liu@acmecorp.example.com',
      background: 'Network and connectivity team lead. CCIE certified. Evaluating SD-WAN solutions.',
      stakeholderRole: 'END_USER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 42,
      engagementStatus: 'INITIAL_CONTACT',
      organizationId: acme.id,
      departmentId: acmeIT.id,
      reportsToId: vpIT.id,
    },
  });

  // --- Finance team (3) - stale contacts ---
  const finAnalyst1 = await prisma.contact.create({
    data: {
      name: 'Peter Walsh',
      title: 'Senior Financial Analyst',
      email: 'peter.walsh@acmecorp.example.com',
      background: 'Handles vendor financial analysis. Works closely with procurement.',
      stakeholderRole: 'END_USER',
      sentiment: 'RESISTANT',
      influenceLevel: 'LOW',
      relationshipScore: 15,
      engagementStatus: 'NOT_YET_ENGAGED',
      organizationId: acme.id,
      departmentId: acmeFinance.id,
      reportsToId: dirFinance.id,
    },
  });

  const finAnalyst2 = await prisma.contact.create({
    data: {
      name: 'Grace Hernandez',
      title: 'Procurement Specialist',
      email: 'grace.hernandez@acmecorp.example.com',
      background: 'Manages vendor onboarding and contract negotiations. Very process-driven.',
      stakeholderRole: 'GATEKEEPER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 18,
      engagementStatus: 'NOT_YET_ENGAGED',
      organizationId: acme.id,
      departmentId: acmeFinance.id,
      reportsToId: dirFinance.id,
    },
  });

  const finAnalyst3 = await prisma.contact.create({
    data: {
      name: 'Kevin Pham',
      title: 'Budget Controller',
      email: 'kevin.pham@acmecorp.example.com',
      background: 'Controls departmental budgets. Signs off on expenditures over $50K.',
      stakeholderRole: 'ECONOMIC_BUYER',
      sentiment: 'RESISTANT',
      influenceLevel: 'MEDIUM',
      relationshipScore: 22,
      engagementStatus: 'NOT_YET_ENGAGED',
      organizationId: acme.id,
      departmentId: acmeFinance.id,
      reportsToId: dirFinance.id,
    },
  });

  // --- Individual Contributors across departments (10) ---
  const ic1 = await prisma.contact.create({
    data: {
      name: 'Tyler Brooks',
      title: 'Senior Software Engineer',
      email: 'tyler.brooks@acmecorp.example.com',
      background: 'Full-stack engineer on the platform team. Early adopter of our tools.',
      stakeholderRole: 'END_USER',
      sentiment: 'ADVOCATE',
      influenceLevel: 'LOW',
      relationshipScore: 70,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: engMgr1.id,
    },
  });

  const ic2 = await prisma.contact.create({
    data: {
      name: 'Jasmine Carter',
      title: 'Software Engineer',
      email: 'jasmine.carter@acmecorp.example.com',
      background: 'Backend engineer working on microservices migration.',
      stakeholderRole: 'END_USER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'LOW',
      relationshipScore: 55,
      engagementStatus: 'RELATIONSHIP_BUILDING',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: engMgr2.id,
    },
  });

  const ic3 = await prisma.contact.create({
    data: {
      name: 'Derek Kim',
      title: 'Senior Software Engineer',
      email: 'derek.kim@acmecorp.example.com',
      background: 'Frontend specialist. Active in internal developer advocacy.',
      stakeholderRole: 'END_USER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'LOW',
      relationshipScore: 50,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: engMgr3.id,
    },
  });

  const ic4 = await prisma.contact.create({
    data: {
      name: 'Aisha Patel',
      title: 'Data Engineer',
      email: 'aisha.patel@acmecorp.example.com',
      background: 'Works on data pipeline infrastructure. Evaluating our analytics tooling.',
      stakeholderRole: 'END_USER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 40,
      engagementStatus: 'INITIAL_CONTACT',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: engMgr4.id,
    },
  });

  const ic5 = await prisma.contact.create({
    data: {
      name: 'Matt Johnson',
      title: 'DevOps Engineer',
      email: 'matt.johnson@acmecorp.example.com',
      background: 'CI/CD pipeline specialist. Power user of our managed services.',
      stakeholderRole: 'END_USER',
      sentiment: 'ADVOCATE',
      influenceLevel: 'LOW',
      relationshipScore: 72,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: engMgr5.id,
    },
  });

  const ic6 = await prisma.contact.create({
    data: {
      name: 'Sophie Laurent',
      title: 'QA Engineer',
      email: 'sophie.laurent@acmecorp.example.com',
      background: 'Test automation engineer. Interested in AI-powered testing.',
      stakeholderRole: 'END_USER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 30,
      engagementStatus: 'OUTREACH_INITIATED',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: engMgr6.id,
    },
  });

  const ic7 = await prisma.contact.create({
    data: {
      name: 'Carlos Mendez',
      title: 'Security Analyst',
      email: 'carlos.mendez@acmecorp.example.com',
      background: 'Security operations analyst. Runs vulnerability assessments.',
      stakeholderRole: 'END_USER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'LOW',
      relationshipScore: 48,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeIT.id,
      reportsToId: itMgr1.id,
    },
  });

  const ic8 = await prisma.contact.create({
    data: {
      name: 'Emma Wilson',
      title: 'Cloud Engineer',
      email: 'emma.wilson@acmecorp.example.com',
      background: 'Cloud infrastructure engineer. AWS certified. Works on Terraform automation.',
      stakeholderRole: 'END_USER',
      sentiment: 'ADVOCATE',
      influenceLevel: 'LOW',
      relationshipScore: 65,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeIT.id,
      reportsToId: itMgr3.id,
    },
  });

  const ic9 = await prisma.contact.create({
    data: {
      name: 'Olivia Bennett',
      title: 'Product Analyst',
      email: 'olivia.bennett@acmecorp.example.com',
      background: 'Data-driven product analyst working on user behavior analytics.',
      stakeholderRole: 'END_USER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 35,
      engagementStatus: 'OUTREACH_INITIATED',
      organizationId: acme.id,
      departmentId: acmeProduct.id,
      reportsToId: pm5.id,
    },
  });

  const ic10 = await prisma.contact.create({
    data: {
      name: 'Nathan Lee',
      title: 'SRE Lead',
      email: 'nathan.lee@acmecorp.example.com',
      background: 'Site reliability engineering lead. Critical contact for infrastructure decisions.',
      stakeholderRole: 'TECHNICAL_EVALUATOR',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 60,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: acme.id,
      departmentId: acmeEng.id,
      reportsToId: engMgr5.id,
    },
  });

  // New stakeholder who replaced champion on Digital Transformation
  const newStakeholder = await prisma.contact.create({
    data: {
      name: 'Victoria Adams',
      title: 'Chief of Staff',
      email: 'victoria.adams@acmecorp.example.com',
      background:
        'Recently promoted to Chief of Staff. Taking over strategic initiatives after previous VP Strategy departed. New to vendor relationships.',
      stakeholderRole: 'INFLUENCER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'HIGH',
      relationshipScore: 25,
      engagementStatus: 'INITIAL_CONTACT',
      organizationId: acme.id,
      departmentId: acmeExec.id,
      reportsToId: ceo.id,
    },
  });

  console.log('  Created 40+ Acme Corp contacts');

  // =========================================================================
  // 4. GLOBALTECH CONTACTS (15)
  // =========================================================================
  console.log('Creating GlobalTech contacts...');

  const gtCeo = await prisma.contact.create({
    data: {
      name: 'Amanda Foster',
      title: 'CEO',
      email: 'amanda.foster@globaltech.example.com',
      phone: '+1-555-200-0001',
      background: 'Founded GlobalTech 8 years ago. Previously CTO at a mid-stage startup. Strong technical background.',
      stakeholderRole: 'EXECUTIVE_SPONSOR',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'HIGH',
      relationshipScore: 55,
      engagementStatus: 'INITIAL_CONTACT',
      isKeyStakeholder: true,
      ourGoals: 'Secure executive buy-in for analytics platform deal. Position EPAM as long-term technology partner for GlobalTech growth phase.',
      organizationId: globaltech.id,
      departmentId: gtOps.id,
    },
  });

  const gtVpEng = await prisma.contact.create({
    data: {
      name: 'Jason Park',
      title: 'VP Engineering',
      email: 'jason.park@globaltech.example.com',
      phone: '+1-555-200-0002',
      background: 'Leads engineering. Growing the team rapidly. Looking for tools to improve developer productivity.',
      stakeholderRole: 'DECISION_MAKER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'HIGH',
      relationshipScore: 60,
      engagementStatus: 'RELATIONSHIP_BUILDING',
      isKeyStakeholder: true,
      ourGoals: 'Convert from evaluator to champion. Win the analytics platform deal as beachhead for broader engagement. Build trust through technical depth.',
      organizationId: globaltech.id,
      departmentId: gtEng.id,
      reportsToId: gtCeo.id,
    },
  });

  const gtVpSales = await prisma.contact.create({
    data: {
      name: 'Michelle Chen',
      title: 'VP Sales',
      email: 'michelle.chen@globaltech.example.com',
      phone: '+1-555-200-0003',
      background: 'Driving aggressive growth targets. Needs analytics and reporting tools.',
      stakeholderRole: 'INFLUENCER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'MEDIUM',
      relationshipScore: 40,
      engagementStatus: 'OUTREACH_INITIATED',
      organizationId: globaltech.id,
      departmentId: gtSales.id,
      reportsToId: gtCeo.id,
    },
  });

  const gtDirOps = await prisma.contact.create({
    data: {
      name: 'Kevin Wu',
      title: 'Director of Operations',
      email: 'kevin.wu@globaltech.example.com',
      phone: '+1-555-200-0004',
      background: 'Operational efficiency focused. Manages customer success and support teams.',
      stakeholderRole: 'INFLUENCER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 45,
      engagementStatus: 'INITIAL_CONTACT',
      organizationId: globaltech.id,
      departmentId: gtOps.id,
      reportsToId: gtCeo.id,
    },
  });

  const gtEngMgr1 = await prisma.contact.create({
    data: {
      name: 'Laura Kim',
      title: 'Engineering Manager',
      email: 'laura.kim@globaltech.example.com',
      background: 'Backend engineering team lead. Python and Django stack.',
      stakeholderRole: 'TECHNICAL_EVALUATOR',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'MEDIUM',
      relationshipScore: 52,
      engagementStatus: 'RELATIONSHIP_BUILDING',
      isKeyStakeholder: true,
      ourGoals: 'Develop as technical champion. Leverage her influence on analytics platform evaluation. Ensure she sees value in our approach over competitors.',
      organizationId: globaltech.id,
      departmentId: gtEng.id,
      reportsToId: gtVpEng.id,
    },
  });

  const gtEngMgr2 = await prisma.contact.create({
    data: {
      name: 'Sean O\'Malley',
      title: 'Engineering Manager - Infrastructure',
      email: 'sean.omalley@globaltech.example.com',
      background: 'Infrastructure and DevOps lead. AWS focused.',
      stakeholderRole: 'TECHNICAL_EVALUATOR',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 38,
      engagementStatus: 'OUTREACH_INITIATED',
      organizationId: globaltech.id,
      departmentId: gtEng.id,
      reportsToId: gtVpEng.id,
    },
  });

  const gtSalesMgr = await prisma.contact.create({
    data: {
      name: 'Rebecca Taylor',
      title: 'Sales Operations Manager',
      email: 'rebecca.taylor@globaltech.example.com',
      background: 'Manages sales tooling and CRM. Data analytics background.',
      stakeholderRole: 'END_USER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'LOW',
      relationshipScore: 35,
      engagementStatus: 'INITIAL_CONTACT',
      organizationId: globaltech.id,
      departmentId: gtSales.id,
      reportsToId: gtVpSales.id,
    },
  });

  const gtDev1 = await prisma.contact.create({
    data: {
      name: 'Tony Nguyen',
      title: 'Senior Developer',
      email: 'tony.nguyen@globaltech.example.com',
      background: 'Full-stack developer. React and Node.js. Team tech lead.',
      stakeholderRole: 'END_USER',
      sentiment: 'ADVOCATE',
      influenceLevel: 'LOW',
      relationshipScore: 58,
      engagementStatus: 'ACTIVE_RELATIONSHIP',
      organizationId: globaltech.id,
      departmentId: gtEng.id,
      reportsToId: gtEngMgr1.id,
    },
  });

  const gtDev2 = await prisma.contact.create({
    data: {
      name: 'Priya Singh',
      title: 'Data Analyst',
      email: 'priya.singh@globaltech.example.com',
      background: 'Analytics and reporting. Evaluating data platforms.',
      stakeholderRole: 'END_USER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 30,
      engagementStatus: 'OUTREACH_INITIATED',
      organizationId: globaltech.id,
      departmentId: gtOps.id,
      reportsToId: gtDirOps.id,
    },
  });

  const gtDev3 = await prisma.contact.create({
    data: {
      name: 'Alex Johnson',
      title: 'DevOps Engineer',
      email: 'alex.johnson@globaltech.example.com',
      background: 'CI/CD and deployment automation. Docker and Kubernetes.',
      stakeholderRole: 'END_USER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'LOW',
      relationshipScore: 42,
      engagementStatus: 'INITIAL_CONTACT',
      organizationId: globaltech.id,
      departmentId: gtEng.id,
      reportsToId: gtEngMgr2.id,
    },
  });

  const gtSalesRep1 = await prisma.contact.create({
    data: {
      name: 'Jordan Blake',
      title: 'Account Executive',
      email: 'jordan.blake@globaltech.example.com',
      background: 'Enterprise sales. Handles key accounts.',
      stakeholderRole: 'END_USER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 28,
      engagementStatus: 'NOT_YET_ENGAGED',
      organizationId: globaltech.id,
      departmentId: gtSales.id,
      reportsToId: gtVpSales.id,
    },
  });

  const gtSalesRep2 = await prisma.contact.create({
    data: {
      name: 'Hannah Green',
      title: 'Sales Development Rep',
      email: 'hannah.green@globaltech.example.com',
      background: 'Outbound sales development. High energy, new to the company.',
      stakeholderRole: 'END_USER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 20,
      engagementStatus: 'NOT_YET_ENGAGED',
      organizationId: globaltech.id,
      departmentId: gtSales.id,
      reportsToId: gtVpSales.id,
    },
  });

  const gtOpsAnalyst = await prisma.contact.create({
    data: {
      name: 'Chris Patel',
      title: 'Operations Analyst',
      email: 'chris.patel@globaltech.example.com',
      background: 'Process optimization and metrics. Six Sigma certified.',
      stakeholderRole: 'END_USER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'LOW',
      relationshipScore: 25,
      engagementStatus: 'NOT_YET_ENGAGED',
      organizationId: globaltech.id,
      departmentId: gtOps.id,
      reportsToId: gtDirOps.id,
    },
  });

  const gtCsm = await prisma.contact.create({
    data: {
      name: 'Diana Morales',
      title: 'Customer Success Manager',
      email: 'diana.morales@globaltech.example.com',
      background: 'Customer success lead. Manages enterprise customer relationships.',
      stakeholderRole: 'END_USER',
      sentiment: 'SUPPORTIVE',
      influenceLevel: 'LOW',
      relationshipScore: 32,
      engagementStatus: 'OUTREACH_INITIATED',
      organizationId: globaltech.id,
      departmentId: gtOps.id,
      reportsToId: gtDirOps.id,
    },
  });

  const gtFinance = await prisma.contact.create({
    data: {
      name: 'Robert Lee',
      title: 'Finance Manager',
      email: 'robert.lee@globaltech.example.com',
      background: 'Financial planning and budgeting for technology investments.',
      stakeholderRole: 'ECONOMIC_BUYER',
      sentiment: 'NEUTRAL',
      influenceLevel: 'MEDIUM',
      relationshipScore: 30,
      engagementStatus: 'NOT_YET_ENGAGED',
      organizationId: globaltech.id,
      departmentId: gtOps.id,
      reportsToId: gtCeo.id,
    },
  });

  console.log('  Created 15 GlobalTech contacts');

  // =========================================================================
  // 5. PROJECTS
  // =========================================================================
  console.log('Creating projects...');

  // Active Delivery -- "Delivering" stage (In Flight)
  const projCloudMigration = await prisma.project.create({
    data: {
      name: 'Cloud Migration Phase 2',
      description:
        'Migration of remaining on-premise workloads to AWS and Azure. Includes Kubernetes orchestration, CI/CD pipeline modernization, and multi-region DR setup.',
      type: 'ACTIVE',
      stage: 'Delivering',
      healthStatus: 'HEALTHY',
      contractStatus: 'CONTRACTED',
      estimatedValue: 2400000,
      coverageScore: 85,
      organizationId: acme.id,
      departmentId: acmeEng.id,
    },
  });

  // Presales -- "Qualifying" stage
  const projAIPlatform = await prisma.project.create({
    data: {
      name: 'AI Platform Assessment',
      description:
        'Evaluation of AI/ML platform capabilities for Acme product suite. Currently single-threaded through Tom Harris -- major risk if he changes role or priorities.',
      type: 'PRESALES',
      stage: 'Qualifying',
      healthStatus: 'MONITOR',
      contractStatus: 'PROPOSED',
      estimatedValue: 800000,
      coverageScore: 15,
      winLikelihood: 35,
      organizationId: acme.id,
      departmentId: acmeProduct.id,
    },
  });

  // Ongoing -- "Stable" stage (Complete/Steady-state)
  const projManagedSecurity = await prisma.project.create({
    data: {
      name: 'Managed Security Services',
      description:
        'Ongoing managed security monitoring, vulnerability scanning, and incident response for Acme IT infrastructure.',
      type: 'ONGOING',
      stage: 'Stable',
      healthStatus: 'HEALTHY',
      contractStatus: 'INVOICING',
      estimatedValue: 1200000,
      coverageScore: 70,
      organizationId: acme.id,
      departmentId: acmeIT.id,
    },
  });

  // Pre-Start -- "Won" stage
  const projDigitalTransform = await prisma.project.create({
    data: {
      name: 'Digital Transformation Roadmap',
      description:
        'Strategic consulting engagement to define 3-year digital transformation roadmap. Won deal after extensive stakeholder alignment. Mobilization pending.',
      type: 'STRATEGIC',
      stage: 'Won',
      healthStatus: 'HEALTHY',
      contractStatus: 'VERBAL_COMMIT',
      estimatedValue: 500000,
      coverageScore: 30,
      winLikelihood: 95,
      organizationId: acme.id,
      departmentId: acmeExec.id,
    },
  });

  // Presales -- "Proposing" stage
  const projDataAnalytics = await prisma.project.create({
    data: {
      name: 'Data Analytics Platform',
      description:
        'Proposal for a modern data analytics platform for GlobalTech. Early-stage discussions with engineering leadership.',
      type: 'PRESALES',
      stage: 'Proposing',
      healthStatus: 'MONITOR',
      contractStatus: 'PROPOSED',
      estimatedValue: 350000,
      coverageScore: 40,
      winLikelihood: 60,
      organizationId: globaltech.id,
      departmentId: gtEng.id,
    },
  });

  console.log('  Created 5 projects');

  // =========================================================================
  // 6. PROJECT MEMBERS (with engagementRoles)
  // =========================================================================
  console.log('Creating project members...');

  // Cloud Migration -- well-covered (9/11 engagement roles filled)
  // Missing: BUDGET_AUTHORITY, BLOCKER
  const projectMembers = await prisma.$transaction([
    // VP Engineering: TECH_APPROVER, TECH_DOMAIN_EXPERT, DAY_TO_DAY_CONTACT
    prisma.projectMember.create({
      data: {
        projectId: projCloudMigration.id,
        contactId: vpEng.id,
        role: 'Executive Sponsor',
        engagementRoles: JSON.stringify(['TECH_APPROVER', 'TECH_DOMAIN_EXPERT', 'DAY_TO_DAY_CONTACT']),
      },
    }),
    // Alex Rivera (Champion): BUSINESS_DOMAIN_EXPERT, CHAMPION
    prisma.projectMember.create({
      data: {
        projectId: projCloudMigration.id,
        contactId: engMgr1.id,
        role: 'Technical Lead',
        engagementRoles: JSON.stringify(['BUSINESS_DOMAIN_EXPERT', 'CHAMPION']),
      },
    }),
    // James O'Brien (DevOps Lead): PROCESS_OWNER
    prisma.projectMember.create({
      data: {
        projectId: projCloudMigration.id,
        contactId: engMgr5.id,
        role: 'DevOps Lead',
        engagementRoles: JSON.stringify(['PROCESS_OWNER']),
      },
    }),
    // Ryan Park (Architecture Review): TECH_DOMAIN_EXPERT
    prisma.projectMember.create({
      data: {
        projectId: projCloudMigration.id,
        contactId: engLead1.id,
        role: 'Architecture Review',
        engagementRoles: JSON.stringify(['TECH_DOMAIN_EXPERT']),
      },
    }),
    // Marcus Thompson (Infrastructure Lead): DATA_DOMAIN_EXPERT
    prisma.projectMember.create({
      data: {
        projectId: projCloudMigration.id,
        contactId: itMgr3.id,
        role: 'Infrastructure Lead',
        engagementRoles: JSON.stringify(['DATA_DOMAIN_EXPERT']),
      },
    }),
    // Tyler Brooks: END_USER
    prisma.projectMember.create({
      data: {
        projectId: projCloudMigration.id,
        contactId: ic1.id,
        role: 'Engineer',
        engagementRoles: JSON.stringify(['END_USER']),
      },
    }),
    // Matt Johnson: END_USER
    prisma.projectMember.create({
      data: {
        projectId: projCloudMigration.id,
        contactId: ic5.id,
        role: 'DevOps Engineer',
        engagementRoles: JSON.stringify(['END_USER']),
      },
    }),
    // Emma Wilson: END_USER
    prisma.projectMember.create({
      data: {
        projectId: projCloudMigration.id,
        contactId: ic8.id,
        role: 'Cloud Engineer',
        engagementRoles: JSON.stringify(['END_USER']),
      },
    }),
    // Nathan Lee: BUSINESS_APPROVER, FINAL_APPROVER
    prisma.projectMember.create({
      data: {
        projectId: projCloudMigration.id,
        contactId: ic10.id,
        role: 'SRE',
        engagementRoles: JSON.stringify(['BUSINESS_APPROVER', 'FINAL_APPROVER']),
      },
    }),

    // AI Platform -- single-threaded (only Tom Harris!) -- 1/9 = 11% coverage
    prisma.projectMember.create({
      data: {
        projectId: projAIPlatform.id,
        contactId: pm2.id,
        role: 'Product Owner',
        engagementRoles: JSON.stringify(['CHAMPION']),
      },
    }),

    // Managed Security -- moderate coverage (4/6)
    prisma.projectMember.create({
      data: {
        projectId: projManagedSecurity.id,
        contactId: vpIT.id,
        role: 'Executive Sponsor',
        engagementRoles: JSON.stringify(['BUSINESS_APPROVER', 'FINAL_APPROVER']),
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projManagedSecurity.id,
        contactId: itMgr1.id,
        role: 'Security Lead',
        engagementRoles: JSON.stringify(['TECH_APPROVER', 'DAY_TO_DAY_CONTACT']),
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projManagedSecurity.id,
        contactId: ic7.id,
        role: 'Security Analyst',
        engagementRoles: JSON.stringify(['TECH_DOMAIN_EXPERT']),
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projManagedSecurity.id,
        contactId: engLead2.id,
        role: 'Security Engineering',
        engagementRoles: JSON.stringify(['PROCESS_OWNER']),
      },
    }),

    // Digital Transformation -- AT RISK, thin coverage
    prisma.projectMember.create({
      data: {
        projectId: projDigitalTransform.id,
        contactId: ceo.id,
        role: 'Executive Sponsor',
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projDigitalTransform.id,
        contactId: newStakeholder.id,
        role: 'Program Lead',
      },
    }),

    // Data Analytics -- GlobalTech (moderate coverage 2-3 members)
    prisma.projectMember.create({
      data: {
        projectId: projDataAnalytics.id,
        contactId: gtVpEng.id,
        role: 'Decision Maker',
        engagementRoles: JSON.stringify(['BUSINESS_APPROVER', 'TECH_APPROVER']),
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projDataAnalytics.id,
        contactId: gtEngMgr1.id,
        role: 'Technical Evaluator',
        engagementRoles: JSON.stringify(['TECH_DOMAIN_EXPERT', 'DAY_TO_DAY_CONTACT']),
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projDataAnalytics.id,
        contactId: gtDev2.id,
        role: 'End User',
        engagementRoles: JSON.stringify(['DATA_DOMAIN_EXPERT']),
      },
    }),
  ]);

  console.log(`  Created ${projectMembers.length} project member assignments`);

  // =========================================================================
  // 7. COMMUNICATIONS (30+)
  // =========================================================================
  console.log('Creating communications...');

  // Helper to create a communication with participants and optionally project links
  async function createComm(data: {
    type: string;
    date: Date;
    summary: string;
    detail?: string;
    sentiment?: string;
    participantIds: string[];
    projectIds?: string[];
  }) {
    const comm = await prisma.communication.create({
      data: {
        type: data.type,
        date: data.date,
        summary: data.summary,
        detail: data.detail,
        sentiment: data.sentiment,
        participants: {
          create: data.participantIds.map((contactId) => ({ contactId })),
        },
        projects: data.projectIds
          ? { create: data.projectIds.map((projectId) => ({ projectId })) }
          : undefined,
      },
    });
    return comm;
  }

  // --- Acme Engineering communications (frequent, recent) ---
  await createComm({
    type: 'VIDEO_CALL',
    date: daysAgo(2),
    summary: 'Cloud Migration Phase 2 - Weekly status call',
    detail:
      'Reviewed migration progress for batch 3 workloads. 12 of 15 services migrated successfully. Discussed performance benchmarking results. Alex shared that latency improved 40% post-migration. Next batch planned for next sprint.',
    sentiment: 'ADVOCATE',
    participantIds: [vpEng.id, engMgr1.id, engMgr5.id, ic1.id, ic5.id],
    projectIds: [projCloudMigration.id],
  });

  await createComm({
    type: 'IN_PERSON',
    date: daysAgo(5),
    summary: 'Architecture review session - API Gateway design',
    detail:
      'In-person workshop at Acme HQ. Reviewed proposed API gateway architecture. Ryan Park raised concerns about rate limiting strategy. Agreed on a phased rollout approach. Jane confirmed budget approval for additional tooling.',
    sentiment: 'SUPPORTIVE',
    participantIds: [vpEng.id, engLead1.id, engMgr2.id, engMgr1.id],
    projectIds: [projCloudMigration.id],
  });

  await createComm({
    type: 'EMAIL',
    date: daysAgo(7),
    summary: 'Cloud Migration - Kubernetes cluster sizing proposal',
    detail:
      'Sent detailed proposal for production Kubernetes cluster configuration. Included cost analysis and scaling recommendations. Matt Johnson replied with questions about auto-scaling policies.',
    sentiment: 'SUPPORTIVE',
    participantIds: [engMgr1.id, ic5.id, itMgr3.id],
    projectIds: [projCloudMigration.id],
  });

  await createComm({
    type: 'VIDEO_CALL',
    date: daysAgo(9),
    summary: 'Cloud Migration Phase 2 - Weekly status call',
    detail:
      'Batch 2 migration complete. Zero downtime achieved. Discussed monitoring and alerting setup. Nathan Lee presented SRE dashboard requirements.',
    sentiment: 'ADVOCATE',
    participantIds: [vpEng.id, engMgr1.id, ic10.id, ic8.id],
    projectIds: [projCloudMigration.id],
  });

  await createComm({
    type: 'COFFEE_MEAL',
    date: daysAgo(12),
    summary: 'Lunch with Jane Smith - relationship building',
    detail:
      'Informal lunch. Jane shared that CTO Priya is very pleased with migration progress. Mentioned upcoming board meeting where cloud strategy will be presented. Hinted at potential expansion of scope to include data platform modernization.',
    sentiment: 'ADVOCATE',
    participantIds: [vpEng.id],
  });

  await createComm({
    type: 'PHONE_CALL',
    date: daysAgo(14),
    summary: 'DevOps tooling discussion with James',
    detail:
      'James called to discuss CI/CD pipeline integration options. Very enthusiastic about our managed services offering. Wants to schedule a demo for his team.',
    sentiment: 'ADVOCATE',
    participantIds: [engMgr5.id, ic5.id],
    projectIds: [projCloudMigration.id],
  });

  await createComm({
    type: 'VIDEO_CALL',
    date: daysAgo(16),
    summary: 'Cloud Migration Phase 2 - Weekly status call',
    detail:
      'Reviewed batch 1 completion metrics. All performance SLAs met. Discussed batch 2 migration plan. Identified 3 legacy services requiring refactoring before migration.',
    sentiment: 'SUPPORTIVE',
    participantIds: [vpEng.id, engMgr1.id, engMgr5.id, ic1.id],
    projectIds: [projCloudMigration.id],
  });

  await createComm({
    type: 'MESSAGE',
    date: daysAgo(18),
    summary: 'Slack thread: Tyler Brooks shared migration success metrics',
    detail:
      'Tyler posted migration success metrics in the #cloud-migration channel. Service response times down 35%, deployment frequency up 4x. Tagged our team with thanks.',
    sentiment: 'ADVOCATE',
    participantIds: [ic1.id],
    projectIds: [projCloudMigration.id],
  });

  // --- Managed Security communications ---
  await createComm({
    type: 'VIDEO_CALL',
    date: daysAgo(4),
    summary: 'Monthly security review - Managed Security Services',
    detail:
      'Reviewed monthly threat report. 3 critical vulnerabilities identified and patched within SLA. David expressed satisfaction with response times. Brian confirmed audit preparation is on track.',
    sentiment: 'SUPPORTIVE',
    participantIds: [vpIT.id, itMgr1.id, ic7.id],
    projectIds: [projManagedSecurity.id],
  });

  await createComm({
    type: 'EMAIL',
    date: daysAgo(11),
    summary: 'Security incident report - false positive investigation',
    detail:
      'Sent detailed analysis of false positive alert from last week. Root cause identified and tuning recommendations provided. Nina reviewed and approved the changes.',
    sentiment: 'NEUTRAL',
    participantIds: [itMgr1.id, engLead2.id],
    projectIds: [projManagedSecurity.id],
  });

  await createComm({
    type: 'IN_PERSON',
    date: daysAgo(22),
    summary: 'Quarterly business review - Managed Security Services',
    detail:
      'QBR at Acme HQ. Presented quarterly metrics: 99.97% uptime, 23 min avg incident response time. David Washington very satisfied. Discussed scope expansion to include cloud security posture management.',
    sentiment: 'ADVOCATE',
    participantIds: [vpIT.id, itMgr1.id, itMgr2.id, engLead2.id],
    projectIds: [projManagedSecurity.id],
  });

  await createComm({
    type: 'PHONE_CALL',
    date: daysAgo(30),
    summary: 'Security compliance preparation call',
    detail:
      'Discussed SOC2 audit preparation. Brian needs documentation of our security controls by end of month.',
    sentiment: 'SUPPORTIVE',
    participantIds: [itMgr1.id, ic7.id],
    projectIds: [projManagedSecurity.id],
  });

  // --- AI Platform communications (sparse -- single-threaded risk) ---
  await createComm({
    type: 'VIDEO_CALL',
    date: daysAgo(21),
    summary: 'AI Platform Assessment - Initial discovery call',
    detail:
      'First discovery call with Tom Harris. Discussed AI/ML use cases across Acme product suite. Tom is the sole product owner for this initiative. No other stakeholders involved yet -- significant single-threading risk.',
    sentiment: 'SUPPORTIVE',
    participantIds: [pm2.id],
    projectIds: [projAIPlatform.id],
  });

  await createComm({
    type: 'EMAIL',
    date: daysAgo(35),
    summary: 'AI Platform - Capabilities overview sent',
    detail:
      'Sent overview of our AI/ML platform capabilities to Tom. Included case studies from similar deployments. No response yet from broader product team.',
    sentiment: 'NEUTRAL',
    participantIds: [pm2.id],
    projectIds: [projAIPlatform.id],
  });

  // --- Digital Transformation communications (declining engagement) ---
  await createComm({
    type: 'VIDEO_CALL',
    date: daysAgo(8),
    summary: 'Digital Transformation - Introduction meeting with Victoria Adams',
    detail:
      'First meeting with Victoria Adams who replaced the previous VP Strategy. Victoria is still getting up to speed on the engagement. Was polite but noncommittal. Needs time to review existing materials before proceeding.',
    sentiment: 'NEUTRAL',
    participantIds: [newStakeholder.id],
    projectIds: [projDigitalTransform.id],
  });

  await createComm({
    type: 'EMAIL',
    date: daysAgo(28),
    summary: 'Digital Transformation - Project brief sent to Victoria Adams',
    detail:
      'Sent comprehensive project brief and timeline to Victoria. Included previous meeting notes and agreed-upon deliverables from the earlier engagement with the VP Strategy.',
    sentiment: 'NEUTRAL',
    participantIds: [newStakeholder.id],
    projectIds: [projDigitalTransform.id],
  });

  await createComm({
    type: 'IN_PERSON',
    date: daysAgo(60),
    summary: 'Digital Transformation - Executive strategy session',
    detail:
      'Workshop with CEO and former VP Strategy. Strong alignment on transformation priorities. CEO expressed full support. This was before the VP Strategy departed.',
    sentiment: 'ADVOCATE',
    participantIds: [ceo.id],
    projectIds: [projDigitalTransform.id],
  });

  // --- CTO and CEO level communications ---
  await createComm({
    type: 'VIDEO_CALL',
    date: daysAgo(15),
    summary: 'Executive check-in with CTO Priya Patel',
    detail:
      'Quarterly executive alignment call. Priya confirmed satisfaction with cloud migration. Interested in discussing AI platform capabilities. Mentioned potential budget increase for next fiscal year.',
    sentiment: 'SUPPORTIVE',
    participantIds: [cto.id, vpEng.id],
    projectIds: [projCloudMigration.id],
  });

  await createComm({
    type: 'CONFERENCE',
    date: daysAgo(25),
    summary: 'Met Robert Chen at CloudWorld conference',
    detail:
      'Brief conversation with CEO Robert Chen at CloudWorld. He expressed strong support for the cloud migration initiative and mentioned Acme board is impressed with progress.',
    sentiment: 'ADVOCATE',
    participantIds: [ceo.id],
  });

  await createComm({
    type: 'COFFEE_MEAL',
    date: daysAgo(20),
    summary: 'Dinner with CTO Priya Patel',
    detail:
      'Dinner at annual tech summit. Priya shared her vision for Acme technology strategy over the next 3 years. Cloud-first is a core pillar. Very interested in our managed services expanding.',
    sentiment: 'SUPPORTIVE',
    participantIds: [cto.id],
  });

  // --- Finance communications (stale -- last contact > 30 days) ---
  await createComm({
    type: 'EMAIL',
    date: daysAgo(65),
    summary: 'Sent updated pricing proposal to Karen Mitchell',
    detail:
      'Emailed revised pricing for next year renewal. No response received. Follow-up email sent 2 weeks later with no reply.',
    sentiment: 'NEUTRAL',
    participantIds: [dirFinance.id],
  });

  await createComm({
    type: 'PHONE_CALL',
    date: daysAgo(75),
    summary: 'Brief call with CFO Michael Torres re: contract renewal',
    detail:
      'Short call about upcoming contract renewal. Michael was distracted and cut the call short. Said Karen Mitchell would handle the details. Seemed disengaged.',
    sentiment: 'NEUTRAL',
    participantIds: [cfo.id],
  });

  // --- GlobalTech communications (newer, less frequent) ---
  await createComm({
    type: 'VIDEO_CALL',
    date: daysAgo(3),
    summary: 'Data Analytics Platform - Discovery call with GlobalTech engineering',
    detail:
      'Initial discovery call with Jason Park and Laura Kim. Discussed their current analytics stack (Redshift + Looker) and pain points. Jason wants to evaluate modern alternatives. Laura has specific requirements around real-time processing.',
    sentiment: 'SUPPORTIVE',
    participantIds: [gtVpEng.id, gtEngMgr1.id],
    projectIds: [projDataAnalytics.id],
  });

  await createComm({
    type: 'EMAIL',
    date: daysAgo(10),
    summary: 'GlobalTech - Introduction to Data Analytics capabilities',
    detail:
      'Sent capabilities overview and relevant case studies to Jason Park. He forwarded to his team for review.',
    sentiment: 'SUPPORTIVE',
    participantIds: [gtVpEng.id],
    projectIds: [projDataAnalytics.id],
  });

  await createComm({
    type: 'VIDEO_CALL',
    date: daysAgo(17),
    summary: 'GlobalTech - Initial intro call with Amanda Foster',
    detail:
      'Brief introduction call with GlobalTech CEO. Amanda was interested but delegated technical evaluation to Jason. Confirmed budget exists for analytics improvements.',
    sentiment: 'SUPPORTIVE',
    participantIds: [gtCeo.id],
    projectIds: [projDataAnalytics.id],
  });

  await createComm({
    type: 'PHONE_CALL',
    date: daysAgo(6),
    summary: 'Follow-up with Tony Nguyen on technical requirements',
    detail:
      'Tony shared detailed requirements for real-time dashboard performance. Very engaged and technical. Could become an internal champion.',
    sentiment: 'ADVOCATE',
    participantIds: [gtDev1.id],
    projectIds: [projDataAnalytics.id],
  });

  await createComm({
    type: 'MESSAGE',
    date: daysAgo(1),
    summary: 'Slack: Tony Nguyen shared our case study internally',
    detail:
      'Tony shared the case study we sent with the #engineering channel at GlobalTech. Positive reception from the team.',
    sentiment: 'ADVOCATE',
    participantIds: [gtDev1.id],
    projectIds: [projDataAnalytics.id],
  });

  // --- Cross-org communications ---
  await createComm({
    type: 'VIDEO_CALL',
    date: daysAgo(13),
    summary: 'Product team check-in - Sarah Kim and Jessica Wu',
    detail:
      'Discussed product integration roadmap. Sarah mentioned interest in our API platform. Jessica provided feedback on current SDK documentation.',
    sentiment: 'SUPPORTIVE',
    participantIds: [vpProduct.id, pm1.id],
  });

  await createComm({
    type: 'EMAIL',
    date: daysAgo(19),
    summary: 'IT infrastructure update from Wendy Zhao',
    detail:
      'Wendy sent SLA performance report. All metrics within target. Requested minor adjustment to alerting thresholds.',
    sentiment: 'SUPPORTIVE',
    participantIds: [itMgr2.id],
    projectIds: [projManagedSecurity.id],
  });

  await createComm({
    type: 'CONFERENCE',
    date: daysAgo(40),
    summary: 'Met Acme team at DevOps Days conference',
    detail:
      'Ran into Alex Rivera and James O\'Brien at DevOps Days. Had productive conversation about container orchestration best practices. They spoke positively about our tools during their lightning talk.',
    sentiment: 'ADVOCATE',
    participantIds: [engMgr1.id, engMgr5.id],
  });

  console.log('  Created 30+ communications');

  // =========================================================================
  // 8. MEETING NOTES (5)
  // =========================================================================
  console.log('Creating meeting notes...');

  // Meeting 1: Cloud Migration Sprint Planning
  const meeting1 = await prisma.meetingNote.create({
    data: {
      date: daysAgo(2),
      meetingType: 'Sprint Planning',
      summary:
        'Cloud Migration Phase 2 sprint planning. Reviewed batch 3 migration plan. Assigned workloads to team members. Discussed risk mitigation for legacy database migration.',
      rawText:
        'Attendees: Jane, Alex, James, Tyler, Matt\n\nAgenda:\n1. Batch 3 workload review\n2. Legacy DB migration approach\n3. Performance testing plan\n4. Timeline confirmation\n\nKey decisions:\n- Legacy DB will use blue-green deployment\n- Performance testing starts next Monday\n- Go-live target: end of month',
      projectId: projCloudMigration.id,
      attendees: {
        create: [
          { contactId: vpEng.id },
          { contactId: engMgr1.id },
          { contactId: engMgr5.id },
          { contactId: ic1.id },
          { contactId: ic5.id },
        ],
      },
    },
  });

  await prisma.personNote.createMany({
    data: [
      {
        meetingNoteId: meeting1.id,
        contactId: vpEng.id,
        wants: 'Ensure migration completes before Q3 board review',
        reactions: 'Very positive about progress. Smiled when hearing about latency improvements.',
        commitments: 'Will secure additional budget for performance testing infrastructure',
      },
      {
        meetingNoteId: meeting1.id,
        contactId: engMgr1.id,
        wants: 'More automated testing coverage before go-live',
        reactions: 'Confident but cautious. Wants to avoid any production incidents.',
        commitments: 'Will finalize migration runbook by Friday',
      },
      {
        meetingNoteId: meeting1.id,
        contactId: engMgr5.id,
        wants: 'CI/CD pipeline improvements for new infrastructure',
        reactions: 'Enthusiastic about new deployment capabilities',
        commitments: 'Will set up monitoring dashboards for batch 3',
      },
    ],
  });

  // Meeting 2: Managed Security QBR
  const meeting2 = await prisma.meetingNote.create({
    data: {
      date: daysAgo(22),
      meetingType: 'Quarterly Business Review',
      summary:
        'Q4 QBR for Managed Security Services. Presented quarterly metrics. Discussed scope expansion to include cloud security posture management (CSPM).',
      rawText:
        'Attendees: David, Brian, Wendy, Nina\n\nMetrics:\n- Uptime: 99.97%\n- Mean incident response: 23 min\n- Critical vuln patch time: < 4 hrs\n- False positive rate: 2.1% (down from 3.8%)\n\nScope expansion discussion:\n- CSPM interest confirmed\n- Need to prepare proposal\n- Budget discussion in next fiscal planning cycle',
      projectId: projManagedSecurity.id,
      attendees: {
        create: [
          { contactId: vpIT.id },
          { contactId: itMgr1.id },
          { contactId: itMgr2.id },
          { contactId: engLead2.id },
        ],
      },
    },
  });

  await prisma.personNote.createMany({
    data: [
      {
        meetingNoteId: meeting2.id,
        contactId: vpIT.id,
        wants: 'Unified security dashboard across cloud and on-prem',
        reactions: 'Very satisfied with service quality. Nodded approvingly at response time metrics.',
        commitments: 'Will advocate for CSPM budget in next planning cycle',
      },
      {
        meetingNoteId: meeting2.id,
        contactId: itMgr1.id,
        wants: 'Better integration with their SIEM (Splunk)',
        reactions: 'Pleased with false positive reduction. Asked detailed questions about detection methodology.',
        commitments: 'Will provide Splunk integration requirements by end of week',
      },
    ],
  });

  // Meeting 3: Digital Transformation -- intro with new stakeholder
  const meeting3 = await prisma.meetingNote.create({
    data: {
      date: daysAgo(8),
      meetingType: 'Introduction',
      summary:
        'Introduction meeting with Victoria Adams who took over from the departed VP Strategy. Victoria is still ramping up. The engagement is at risk of stalling.',
      rawText:
        'Attendees: Victoria Adams\n\nContext: Previous champion (VP Strategy) left Acme 6 weeks ago. Victoria Adams has been appointed Chief of Staff and is inheriting strategic initiatives.\n\nDiscussion:\n- Walked Victoria through project history and deliverables\n- She was polite but clearly overwhelmed with her new responsibilities\n- Asked for 2 weeks to review materials\n- No clear commitment to continue at same pace\n\nRisk: High. Need to rebuild relationship and demonstrate value.',
      projectId: projDigitalTransform.id,
      attendees: {
        create: [{ contactId: newStakeholder.id }],
      },
    },
  });

  await prisma.personNote.createMany({
    data: [
      {
        meetingNoteId: meeting3.id,
        contactId: newStakeholder.id,
        wants: 'Time to get up to speed. Wants a simplified executive summary.',
        reactions: 'Guarded and cautious. Not yet bought in on the value of this engagement.',
        commitments: 'Will review materials and schedule follow-up in 2 weeks',
        notes: 'Risk: Victoria may deprioritize this initiative. Need to get CEO reconfirmation.',
      },
    ],
  });

  // Meeting 4: AI Platform Assessment -- thin coverage
  const meeting4 = await prisma.meetingNote.create({
    data: {
      date: daysAgo(21),
      meetingType: 'Discovery',
      summary:
        'Initial AI Platform discovery session with Tom Harris. Explored use cases for AI/ML across Acme product suite. Tom is enthusiastic but has limited organizational influence.',
      rawText:
        'Attendees: Tom Harris\n\nUse cases discussed:\n1. Predictive analytics for customer churn\n2. AI-powered search and recommendations\n3. Automated content classification\n4. NLP for customer support tickets\n\nTom is the sole product owner. VP Product Sarah Kim aware but not directly involved yet.\n\nNext steps: Tom to build internal business case. We provide technical architecture proposal.',
      projectId: projAIPlatform.id,
      attendees: {
        create: [{ contactId: pm2.id }],
      },
    },
  });

  await prisma.personNote.createMany({
    data: [
      {
        meetingNoteId: meeting4.id,
        contactId: pm2.id,
        wants: 'Proven AI/ML platform with good developer experience',
        reactions: 'Very enthusiastic. Took detailed notes. Asked insightful questions about model training infrastructure.',
        commitments: 'Will draft internal business case within 2 weeks',
        notes: 'Single-threaded risk. Need to get Sarah Kim and data team involved.',
      },
    ],
  });

  // Meeting 5: GlobalTech Discovery
  const meeting5 = await prisma.meetingNote.create({
    data: {
      date: daysAgo(3),
      meetingType: 'Discovery',
      summary:
        'Data Analytics Platform discovery session with GlobalTech engineering team. Discussed current stack, pain points, and requirements for a modern analytics platform.',
      rawText:
        'Attendees: Jason Park, Laura Kim\n\nCurrent stack: Redshift + Looker\nPain points:\n- Query performance degrading with data growth\n- Limited real-time capabilities\n- High Redshift costs\n- Looker licensing expensive\n\nRequirements:\n- Real-time dashboards (< 5s load time)\n- SQL-based interface for analysts\n- Python/R integration for data science team\n- Cost must be < current spend\n\nTimeline: Decision by end of Q2',
      projectId: projDataAnalytics.id,
      attendees: {
        create: [{ contactId: gtVpEng.id }, { contactId: gtEngMgr1.id }],
      },
    },
  });

  await prisma.personNote.createMany({
    data: [
      {
        meetingNoteId: meeting5.id,
        contactId: gtVpEng.id,
        wants: 'Cost-effective modern analytics that can scale with company growth',
        reactions: 'Interested but price-sensitive. Compared our offering to open-source alternatives.',
        commitments: 'Will schedule technical deep-dive with broader team',
      },
      {
        meetingNoteId: meeting5.id,
        contactId: gtEngMgr1.id,
        wants: 'Real-time processing with Python integration for data science workflows',
        reactions: 'Technically engaged. Asked detailed questions about query engine architecture.',
        commitments: 'Will prepare list of benchmark queries for evaluation',
      },
    ],
  });

  console.log('  Created 5 meeting notes with person notes');

  // =========================================================================
  // 9. ACTION ITEMS
  // =========================================================================
  console.log('Creating action items...');

  await prisma.actionItem.createMany({
    data: [
      // Cloud Migration - DONE items
      {
        description: 'Finalize migration runbook for batch 3',
        dueDate: daysAgo(-1),
        status: 'DONE',
        assigneeId: engMgr1.id,
        meetingNoteId: meeting1.id,
        projectId: projCloudMigration.id,
      },
      {
        description: 'Set up monitoring dashboards for batch 3 services',
        dueDate: daysAgo(0),
        status: 'IN_PROGRESS',
        assigneeId: engMgr5.id,
        meetingNoteId: meeting1.id,
        projectId: projCloudMigration.id,
      },
      // Cloud Migration - OPEN items
      {
        description: 'Complete performance testing for batch 3 workloads',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
        assigneeId: ic1.id,
        meetingNoteId: meeting1.id,
        projectId: projCloudMigration.id,
      },
      {
        description: 'Review and approve Kubernetes cluster sizing proposal',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
        assigneeId: vpEng.id,
        projectId: projCloudMigration.id,
      },
      // Managed Security - mixed
      {
        description: 'Provide Splunk integration requirements document',
        dueDate: daysAgo(-5),
        status: 'DONE',
        assigneeId: itMgr1.id,
        meetingNoteId: meeting2.id,
        projectId: projManagedSecurity.id,
      },
      {
        description: 'Prepare CSPM scope expansion proposal',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
        assigneeId: vpIT.id,
        meetingNoteId: meeting2.id,
        projectId: projManagedSecurity.id,
      },
      // Digital Transformation - OVERDUE items
      {
        description: 'Send executive summary of Digital Transformation engagement to Victoria Adams',
        dueDate: daysAgo(5),
        status: 'OPEN',
        assigneeId: newStakeholder.id,
        meetingNoteId: meeting3.id,
        projectId: projDigitalTransform.id,
      },
      {
        description: 'Schedule CEO re-confirmation meeting for Digital Transformation initiative',
        dueDate: daysAgo(3),
        status: 'OPEN',
        assigneeId: ceo.id,
        projectId: projDigitalTransform.id,
      },
      // AI Platform - overdue
      {
        description: 'Draft internal business case for AI Platform investment',
        dueDate: daysAgo(7),
        status: 'OPEN',
        assigneeId: pm2.id,
        meetingNoteId: meeting4.id,
        projectId: projAIPlatform.id,
      },
      {
        description: 'Schedule multi-stakeholder meeting for AI Platform Assessment',
        dueDate: daysAgo(2),
        status: 'OPEN',
        assigneeId: pm2.id,
        projectId: projAIPlatform.id,
      },
      // GlobalTech
      {
        description: 'Prepare benchmark query list for analytics platform evaluation',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
        assigneeId: gtEngMgr1.id,
        meetingNoteId: meeting5.id,
        projectId: projDataAnalytics.id,
      },
      {
        description: 'Schedule technical deep-dive with broader GlobalTech engineering team',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
        assigneeId: gtVpEng.id,
        meetingNoteId: meeting5.id,
        projectId: projDataAnalytics.id,
      },
    ],
  });

  console.log('  Created 12 action items');

  // =========================================================================
  // 10. DESIRES
  // =========================================================================
  console.log('Creating desires...');

  await prisma.desire.createMany({
    data: [
      {
        contactId: vpEng.id,
        category: 'TECHNICAL',
        description: 'Wants to achieve full cloud-native architecture within 18 months. Aims for zero on-premise workloads.',
        date: daysAgo(12),
      },
      {
        contactId: vpEng.id,
        category: 'CAREER',
        description: 'Aspires to CTO role. Wants to demonstrate transformative leadership through successful cloud migration.',
        date: daysAgo(12),
      },
      {
        contactId: cto.id,
        category: 'STRATEGIC',
        description: 'Wants Acme to be recognized as a technology leader. Plans to publish cloud transformation case study.',
        date: daysAgo(20),
      },
      {
        contactId: ceo.id,
        category: 'STRATEGIC',
        description: 'Focused on digital transformation as key differentiator for Acme in the market. Wants to present wins to the board.',
        date: daysAgo(25),
      },
      {
        contactId: engMgr1.id,
        category: 'TECHNICAL',
        description: 'Wants to implement GitOps workflows and advance container orchestration maturity.',
        date: daysAgo(5),
      },
      {
        contactId: pm2.id,
        category: 'TECHNICAL',
        description: 'Wants to launch AI-powered features as differentiator for Acme product suite.',
        date: daysAgo(21),
      },
      {
        contactId: pm2.id,
        category: 'CAREER',
        description: 'Wants to become Director of Product for AI/ML. Looking for high-visibility wins.',
        date: daysAgo(21),
      },
      {
        contactId: vpIT.id,
        category: 'TECHNICAL',
        description: 'Wants unified security monitoring across cloud and on-premise environments.',
        date: daysAgo(22),
      },
      {
        contactId: newStakeholder.id,
        category: 'CAREER',
        description: 'Newly promoted, wants to establish credibility quickly. Looking for quick wins in her portfolio.',
        date: daysAgo(8),
      },
      {
        contactId: gtVpEng.id,
        category: 'TECHNICAL',
        description: 'Wants to modernize analytics stack while keeping costs under control.',
        date: daysAgo(3),
      },
      {
        contactId: engMgr5.id,
        category: 'PERSONAL',
        description: 'Training for marathon. Appreciates meetings scheduled around morning training schedule.',
        date: daysAgo(14),
      },
      {
        contactId: itMgr1.id,
        category: 'CAREER',
        description: 'Working toward CISO certification. Wants exposure to enterprise security governance.',
        date: daysAgo(22),
      },
    ],
  });

  console.log('  Created 12 desires');

  // =========================================================================
  // 11. RELATIONSHIP INTEL (expanded with new required entries)
  // =========================================================================
  console.log('Creating relationship intel...');

  await prisma.relationshipIntel.createMany({
    data: [
      // Existing entries
      {
        contactId: vpEng.id,
        category: 'PERCEPTION',
        description:
          'Jane views us as a strategic partner, not just a vendor. She has publicly praised our work in internal town halls and uses our success as evidence of her leadership.',
        date: daysAgo(5),
        createdBy: 'Sarah Chen',
      },
      {
        contactId: cfo.id,
        category: 'RISK_SIGNAL',
        description:
          'CFO Michael Torres has been vocal about vendor consolidation. He is reviewing all contracts over $500K for potential cost savings. Our managed security contract may be scrutinized.',
        date: daysAgo(30),
        createdBy: 'Sarah Chen',
      },
      {
        contactId: dirFinance.id,
        category: 'RISK_SIGNAL',
        description:
          'Karen Mitchell has been slow-rolling procurement approvals. Multiple vendors have reported delays. This may affect our contract renewal timeline.',
        date: daysAgo(45),
        createdBy: 'David Kim',
      },
      {
        contactId: cto.id,
        category: 'HISTORY',
        description:
          'Priya Patel evaluated our platform when she was at Google 5 years ago. She had concerns about scalability then, but acknowledges significant improvements since.',
        date: daysAgo(20),
        createdBy: 'Marcus Johnson',
      },
      {
        contactId: newStakeholder.id,
        category: 'COMPETITIVE_INTEL',
        description:
          'Victoria Adams previously worked at a company that used Competitor X for similar consulting engagements. She may have a pre-existing preference.',
        date: daysAgo(8),
        createdBy: 'Sarah Chen',
      },
      {
        contactId: engMgr1.id,
        category: 'PERCEPTION',
        description:
          'Alex considers our team among the best partners he has worked with. He has recommended us to peers at other companies.',
        date: daysAgo(12),
        createdBy: 'Marcus Johnson',
      },
      {
        contactId: gtVpEng.id,
        category: 'COMPETITIVE_INTEL',
        description:
          'GlobalTech is also evaluating Snowflake and Databricks for their analytics needs. Jason has strong opinions about cost structures.',
        date: daysAgo(3),
        createdBy: 'Emily Rodriguez',
      },

      // NEW required entries
      // CTO: PERCEPTION
      {
        contactId: cto.id,
        category: 'PERCEPTION',
        description:
          'Early perception shaped through indirect feedback rather than direct engagement. VP Engineering speaks positively but CTO has not been directly briefed.',
        date: daysAgo(10),
        createdBy: 'Sarah Chen',
      },
      // CTO: COMPETITIVE_INTEL
      {
        contactId: cto.id,
        category: 'COMPETITIVE_INTEL',
        description:
          'Appears to be an advocate for Google Cloud and is questioning elements of EPAM\'s technical approach to the migration.',
        date: daysAgo(8),
        createdBy: 'Marcus Johnson',
      },
      // CFO: RISK_SIGNAL (delivery escalation)
      {
        contactId: cfo.id,
        category: 'RISK_SIGNAL',
        description:
          'May have visibility into a recent delivery escalation tied to a fixed-fee project. The escalation was resolved but perception damage is unknown.',
        date: daysAgo(15),
        createdBy: 'David Kim',
      },
      // CFO: HISTORY
      {
        contactId: cfo.id,
        category: 'HISTORY',
        description:
          'Has not previously partnered directly with EPAM. Relationship was established through procurement process only.',
        date: daysAgo(40),
        createdBy: 'Sarah Chen',
      },
      // VP Engineering: PERCEPTION (highly positive)
      {
        contactId: vpEng.id,
        category: 'PERCEPTION',
        description:
          'Highly positive perception. Sees EPAM as an extension of their engineering team. Has advocated for expanded engagement.',
        date: daysAgo(3),
        createdBy: 'Marcus Johnson',
      },
    ],
  });

  console.log('  Created 12 relationship intel entries');

  // =========================================================================
  // 12. ENGAGEMENT STRATEGIES (with new CTO strategy)
  // =========================================================================
  console.log('Creating engagement strategies...');

  const stratFinance = await prisma.engagementStrategy.create({
    data: {
      title: 'Re-engage Acme Finance Department',
      narrative:
        'Finance team has gone cold. Need multi-touch approach: 1) Get CEO/CTO to facilitate introduction to CFO. 2) Position cost savings from cloud migration to appeal to Finance. 3) Offer procurement process optimization as quick win.',
      status: 'ACTIVE',
      contactId: cfo.id,
    },
  });

  const stratAISingleThread = await prisma.engagementStrategy.create({
    data: {
      title: 'De-risk AI Platform single-threading',
      narrative:
        'AI Platform assessment is dangerously single-threaded through Tom Harris. Strategy: 1) Get VP Product Sarah Kim into next meeting. 2) Connect data engineering team (Maria Santos) with use cases. 3) Prepare exec-level pitch for CTO.',
      status: 'ACTIVE',
      contactId: pm2.id,
    },
  });

  const stratDigitalTransform = await prisma.engagementStrategy.create({
    data: {
      title: 'Rebuild Digital Transformation engagement',
      narrative:
        'Previous champion left. New stakeholder Victoria Adams is neutral. Strategy: 1) Get CEO reconfirmation of initiative value. 2) Provide Victoria with concise executive summary. 3) Identify quick wins she can claim as her own. 4) Schedule regular touch-base to build relationship.',
      status: 'ACTIVE',
      contactId: newStakeholder.id,
    },
  });

  const stratGlobalTech = await prisma.engagementStrategy.create({
    data: {
      title: 'Expand GlobalTech footprint',
      narrative:
        'GlobalTech is early stage. Strategy: 1) Win data analytics platform deal as beachhead. 2) Build relationship with CEO through VP Eng. 3) Identify cross-sell opportunities in operations.',
      status: 'ACTIVE',
      contactId: gtVpEng.id,
    },
  });

  // NEW: CTO engagement strategy with 4 grouped NextSteps
  const stratCTO = await prisma.engagementStrategy.create({
    data: {
      title: 'Initial engagement strategy for CTO',
      narrative:
        'Begin engagement through direct reports to establish positive sentiment ahead of the first direct meeting. Prepare a narrative highlighting delivery improvements and technical innovation. Leverage VP Engineering as internal champion. Target: secure first direct meeting within 30 days.',
      status: 'ACTIVE',
      contactId: cto.id,
    },
  });

  console.log('  Created 5 engagement strategies');

  // =========================================================================
  // 13. NEXT STEPS (with CTO strategy steps)
  // =========================================================================
  console.log('Creating next steps...');

  await prisma.nextStep.createMany({
    data: [
      // Finance re-engagement
      {
        type: 'MEETING',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        notes: 'Schedule executive alignment meeting with CEO to get introduction to CFO',
        status: 'PLANNED',
        contactId: ceo.id,
        engagementStrategyId: stratFinance.id,
      },
      {
        type: 'EMAIL',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notes: 'Send cloud migration cost savings report to CFO Michael Torres to demonstrate ROI',
        status: 'PLANNED',
        contactId: cfo.id,
        engagementStrategyId: stratFinance.id,
      },
      // AI Platform de-risk
      {
        type: 'MEETING',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        notes: 'Schedule meeting with VP Product Sarah Kim and Tom Harris to broaden AI assessment stakeholders',
        status: 'PLANNED',
        contactId: vpProduct.id,
        projectId: projAIPlatform.id,
        engagementStrategyId: stratAISingleThread.id,
      },
      {
        type: 'CALL',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        notes: 'Call Maria Santos to discuss data engineering use cases for AI platform',
        status: 'PLANNED',
        contactId: engMgr4.id,
        projectId: projAIPlatform.id,
        engagementStrategyId: stratAISingleThread.id,
      },
      // Digital Transformation rebuild
      {
        type: 'MEETING',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        notes: 'Follow-up meeting with Victoria Adams after she reviews project materials',
        status: 'PLANNED',
        contactId: newStakeholder.id,
        projectId: projDigitalTransform.id,
        engagementStrategyId: stratDigitalTransform.id,
      },
      {
        type: 'EMAIL',
        date: daysAgo(5),
        notes: 'Send simplified executive summary to Victoria Adams',
        status: 'PLANNED',
        contactId: newStakeholder.id,
        projectId: projDigitalTransform.id,
        engagementStrategyId: stratDigitalTransform.id,
      },
      // GlobalTech expansion
      {
        type: 'MEETING',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notes: 'Technical deep-dive session with broader GlobalTech engineering team',
        status: 'PLANNED',
        contactId: gtVpEng.id,
        projectId: projDataAnalytics.id,
        engagementStrategyId: stratGlobalTech.id,
      },
      // Completed steps
      {
        type: 'MEETING',
        date: daysAgo(2),
        notes: 'Cloud Migration sprint planning session completed',
        status: 'COMPLETED',
        contactId: vpEng.id,
        projectId: projCloudMigration.id,
      },
      {
        type: 'MEETING',
        date: daysAgo(22),
        notes: 'Managed Security QBR completed successfully',
        status: 'COMPLETED',
        contactId: vpIT.id,
        projectId: projManagedSecurity.id,
      },
      {
        type: 'CALL',
        date: daysAgo(3),
        notes: 'GlobalTech discovery call with engineering team completed',
        status: 'COMPLETED',
        contactId: gtVpEng.id,
        projectId: projDataAnalytics.id,
      },
      // Overdue planned step
      {
        type: 'EMAIL',
        date: daysAgo(10),
        notes: 'Follow up with Karen Mitchell on procurement timeline',
        status: 'PLANNED',
        contactId: dirFinance.id,
        engagementStrategyId: stratFinance.id,
      },
      {
        type: 'CALL',
        date: daysAgo(7),
        notes: 'Check in with Tom Harris on business case progress',
        status: 'PLANNED',
        contactId: pm2.id,
        projectId: projAIPlatform.id,
        engagementStrategyId: stratAISingleThread.id,
      },

      // --- NEW: CTO engagement strategy next steps (4 grouped) ---
      {
        type: 'MEETING',
        date: daysAgo(10),
        notes: 'Schedule briefing with VP Engineering to prepare CTO talking points',
        status: 'COMPLETED',
        contactId: cto.id,
        engagementStrategyId: stratCTO.id,
      },
      {
        type: 'EMAIL',
        date: daysAgo(7),
        notes: 'Send technical innovation summary document to CTO\'s office',
        status: 'COMPLETED',
        contactId: cto.id,
        engagementStrategyId: stratCTO.id,
      },
      {
        type: 'MEETING',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        notes: 'VP Engineering to introduce CTO at next engineering all-hands',
        status: 'PLANNED',
        contactId: cto.id,
        engagementStrategyId: stratCTO.id,
      },
      {
        type: 'MEETING',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        notes: 'First direct meeting with CTO - executive briefing',
        status: 'PLANNED',
        contactId: cto.id,
        engagementStrategyId: stratCTO.id,
      },
    ],
  });

  console.log('  Created 16 next steps');

  // =========================================================================
  // 14. TEAM MEMBERS
  // =========================================================================
  console.log('Creating team members...');

  const teamSarah = await prisma.teamMember.create({
    data: {
      name: 'Sarah Chen',
      role: 'Account Director',
      expertiseAreas: 'strategy, C-level engagement, executive presentations, account planning',
      email: 'sarah.chen@ourcompany.example.com',
    },
  });

  const teamMarcus = await prisma.teamMember.create({
    data: {
      name: 'Marcus Johnson',
      role: 'Technical Lead',
      expertiseAreas: 'cloud architecture, DevOps, security, Kubernetes, AWS, Azure',
      email: 'marcus.johnson@ourcompany.example.com',
    },
  });

  const teamEmily = await prisma.teamMember.create({
    data: {
      name: 'Emily Rodriguez',
      role: 'Solutions Architect',
      expertiseAreas: 'AI/ML, data engineering, analytics platforms, Python, Spark',
      email: 'emily.rodriguez@ourcompany.example.com',
    },
  });

  const teamDavid = await prisma.teamMember.create({
    data: {
      name: 'David Kim',
      role: 'Project Manager',
      expertiseAreas: 'delivery management, governance, risk mitigation, stakeholder communication',
      email: 'david.kim@ourcompany.example.com',
    },
  });

  const teamLisa = await prisma.teamMember.create({
    data: {
      name: 'Lisa Park',
      role: 'Business Analyst',
      expertiseAreas: 'requirements gathering, process optimization, data analysis, documentation',
      email: 'lisa.park@ourcompany.example.com',
    },
  });

  console.log('  Created 5 team members');

  // =========================================================================
  // 15. TEAM AFFINITIES
  // =========================================================================
  console.log('Creating team affinities...');

  await prisma.teamAffinity.createMany({
    data: [
      // Sarah Chen - strong with execs
      { contactId: ceo.id, teamMemberId: teamSarah.id, affinityLevel: 'HIGH' },
      { contactId: cto.id, teamMemberId: teamSarah.id, affinityLevel: 'HIGH' },
      { contactId: vpEng.id, teamMemberId: teamSarah.id, affinityLevel: 'HIGH' },
      { contactId: cfo.id, teamMemberId: teamSarah.id, affinityLevel: 'LOW' },
      { contactId: gtCeo.id, teamMemberId: teamSarah.id, affinityLevel: 'MEDIUM' },

      // Marcus Johnson - strong with engineering
      { contactId: vpEng.id, teamMemberId: teamMarcus.id, affinityLevel: 'HIGH' },
      { contactId: engMgr1.id, teamMemberId: teamMarcus.id, affinityLevel: 'HIGH' },
      { contactId: engMgr5.id, teamMemberId: teamMarcus.id, affinityLevel: 'HIGH' },
      { contactId: engLead1.id, teamMemberId: teamMarcus.id, affinityLevel: 'HIGH' },
      { contactId: itMgr3.id, teamMemberId: teamMarcus.id, affinityLevel: 'MEDIUM' },
      { contactId: vpIT.id, teamMemberId: teamMarcus.id, affinityLevel: 'MEDIUM' },

      // Emily Rodriguez - strong with data/AI folks
      { contactId: pm2.id, teamMemberId: teamEmily.id, affinityLevel: 'HIGH' },
      { contactId: engMgr4.id, teamMemberId: teamEmily.id, affinityLevel: 'MEDIUM' },
      { contactId: ic4.id, teamMemberId: teamEmily.id, affinityLevel: 'MEDIUM' },
      { contactId: gtEngMgr1.id, teamMemberId: teamEmily.id, affinityLevel: 'MEDIUM' },

      // David Kim - project management relationships
      { contactId: vpEng.id, teamMemberId: teamDavid.id, affinityLevel: 'MEDIUM' },
      { contactId: engMgr1.id, teamMemberId: teamDavid.id, affinityLevel: 'MEDIUM' },
      { contactId: vpIT.id, teamMemberId: teamDavid.id, affinityLevel: 'MEDIUM' },
      { contactId: itMgr1.id, teamMemberId: teamDavid.id, affinityLevel: 'MEDIUM' },

      // Lisa Park - analyst relationships
      { contactId: pm1.id, teamMemberId: teamLisa.id, affinityLevel: 'MEDIUM' },
      { contactId: itMgr2.id, teamMemberId: teamLisa.id, affinityLevel: 'MEDIUM' },
      { contactId: gtDev2.id, teamMemberId: teamLisa.id, affinityLevel: 'LOW' },
    ],
  });

  console.log('  Created 22 team affinities');

  // =========================================================================
  // 16. LINKS
  // =========================================================================
  console.log('Creating links...');

  await prisma.link.createMany({
    data: [
      {
        name: 'Acme Corp Website',
        url: 'https://acmecorp.example.com',
        typeTag: 'website',
        entityType: 'organization',
        entityId: acme.id,
      },
      {
        name: 'Cloud Migration SOW',
        url: 'https://docs.example.com/acme/cloud-migration-sow',
        typeTag: 'contract',
        entityType: 'project',
        entityId: projCloudMigration.id,
      },
      {
        name: 'Managed Security MSA',
        url: 'https://docs.example.com/acme/security-msa',
        typeTag: 'contract',
        entityType: 'project',
        entityId: projManagedSecurity.id,
      },
      {
        name: 'AI Platform Proposal',
        url: 'https://docs.example.com/acme/ai-platform-proposal',
        typeTag: 'proposal',
        entityType: 'project',
        entityId: projAIPlatform.id,
      },
      {
        name: 'Digital Transformation Brief',
        url: 'https://docs.example.com/acme/dt-brief',
        typeTag: 'document',
        entityType: 'project',
        entityId: projDigitalTransform.id,
      },
      {
        name: 'GlobalTech Org Chart',
        url: 'https://docs.example.com/globaltech/org-chart',
        typeTag: 'reference',
        entityType: 'organization',
        entityId: globaltech.id,
      },
      {
        name: 'Jane Smith LinkedIn',
        url: 'https://linkedin.com/in/janesmith',
        typeTag: 'linkedin',
        entityType: 'contact',
        entityId: vpEng.id,
      },
    ],
  });

  console.log('  Created 7 links');

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n--- Seed Summary ---');
  const counts = await Promise.all([
    prisma.organization.count(),
    prisma.department.count(),
    prisma.contact.count(),
    prisma.project.count(),
    prisma.projectMember.count(),
    prisma.communication.count(),
    prisma.communicationParticipant.count(),
    prisma.meetingNote.count(),
    prisma.personNote.count(),
    prisma.actionItem.count(),
    prisma.desire.count(),
    prisma.relationshipIntel.count(),
    prisma.engagementStrategy.count(),
    prisma.nextStep.count(),
    prisma.teamMember.count(),
    prisma.teamAffinity.count(),
    prisma.link.count(),
  ]);

  const labels = [
    'Organizations',
    'Departments',
    'Contacts',
    'Projects',
    'Project Members',
    'Communications',
    'Communication Participants',
    'Meeting Notes',
    'Person Notes',
    'Action Items',
    'Desires',
    'Relationship Intel',
    'Engagement Strategies',
    'Next Steps',
    'Team Members',
    'Team Affinities',
    'Links',
  ];

  labels.forEach((label, i) => {
    console.log(`  ${label}: ${counts[i]}`);
  });

  console.log('\nSeed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
