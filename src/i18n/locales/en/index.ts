import common from './modules/common.json';
import filters from './modules/filters.json';
import users from './modules/users.json';
import roles from './modules/roles.json';
import system from './modules/system.json';
import sidebar from './modules/sidebar.json';

const en = {
  ...common,
  ...filters,
  ...users,
  ...roles,
  ...system,
  ...sidebar,
};

export default en;
