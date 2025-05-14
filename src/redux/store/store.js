import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../reducers/auth';
import assignmentReducer from '../reducers/assignmentLists';
import departmentsReducer from '../reducers/departmentsList';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    assignments: assignmentReducer,
    departments: departmentsReducer,
  },
});
