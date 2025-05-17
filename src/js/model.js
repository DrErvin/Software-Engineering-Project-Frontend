import { RES_PER_PAGE, API_URL, EMPLOYEE_INFO } from './config.js';
import { AJAX, sendFormData } from './helpers.js';
import { calculateRemainingDays } from './helpers.js';

export const state = {
  opportunity: {},
  search: {
    query: {},
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  user: {},
};

const createOpportunityObject = function (data) {
  const opportunity = data[0];
  return {
    id: opportunity.id,
    type: opportunity.type || 'Unknown Type',
    fieldOfStudy: opportunity.fieldOfStudy || 'General',
    title: opportunity.title || 'Untitled Opportunity',
    company: opportunity.company || 'Unknown Company',
    location: opportunity.location || 'Not specified',
    opportunityDescription:
      opportunity.description || 'Description not available',
    yourProfile: opportunity.qualificationsAndRequirements || [],
    tags: opportunity.tags || [],
    experience: opportunity.experienceRequired || [],
    engagementType: opportunity.engagementType || 'Unknown Engagement Type',
    workArrangement: opportunity.workArrangement || 'Unknown Work Arrangement',
    deadline:
      calculateRemainingDays(opportunity.endingDate) || 'No deadline provided',
    benefits: opportunity.benefits || [],
    employeeInfo: opportunity.employeeInfo || EMPLOYEE_INFO,
    contactPerson: opportunity.contactPerson || 'Not specified',
    contactPersonEmail: opportunity.contactPersonEmail || 'Not provided',
  };
};
