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

const createUserObject = function (account) {
  return {
    id: account.id,
    accountType: account.id.startsWith('e-') ? 'employee' : 'Company',
    // id: user.id,
    // nameAndSurname: user.name_and_surname || '',
    // email: user.email || '',
    // password: user.password || '', // Avoid using plaintext passwords; ensure they're hashed in a real application
    // accountType: user.account_type || '',
    // companyName: user.company_name || '',
    // companyLocation: user.company_location || '',
  };
};

export const loadOpportunity = async function (id) {
  try {
    // const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    const data = await AJAX(`${API_URL}/opportunities`);
    console.log(data);
    // console.log(typeof id);

    // Find the opportunity with the specified ID
    const result = data.find((opportunity) => +opportunity.id === +id);
    // console.log(result);
    if (!result) throw new Error(`Opportunity with ID ${id} not found`);

    state.opportunity = createOpportunityObject([result]);

    // Check if recipe that you click on has the same ID as the recipes
    // stored in the bookmark array in state
    // This way each recipe you open will always get a bookmakred
    // tag either true or false
    // if (state.bookmarks.some((bookmark) => bookmark.id === id))
    //   state.recipe.bookmarked = true;
    // else state.recipe.bookmarked = false;

    console.log(state.opportunity);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥`);
    throw err;
  }
};
