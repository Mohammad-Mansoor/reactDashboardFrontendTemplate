import common from './modules/common.json';
import filters from './modules/filters.json';
import users from './modules/users.json';
import roles from './modules/roles.json';
import auth from './modules/auth.json';
import locations from './modules/locations.json';
import sidebar from './modules/sidebar.json';

const ps = {
  ...common,
  ...filters,
  ...users,
  ...roles,
  ...auth,
  ...locations,
  ...sidebar,
};

export default ps;
