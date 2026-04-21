import common from './modules/common.json';
import filters from './modules/filters.json';
import users from './modules/users.json';
import roles from './modules/roles.json';
import auth from './modules/auth.json';
import locations from './modules/locations.json';
import sidebar from './modules/sidebar.json';
import dashboard from './modules/dashboard.json';
import demo from './modules/demo.json';
import tables from './modules/tables.json';
import components from './modules/components.json';

const dr = {
  ...common,
  ...filters,
  ...users,
  ...roles,
  ...auth,
  ...locations,
  ...sidebar,
  ...dashboard,
  ...demo,
  ...tables,
  ...components,
};

export default dr;


