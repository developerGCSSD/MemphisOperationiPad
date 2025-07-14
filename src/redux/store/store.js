import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../reducers/auth';
import assignmentReducer from '../reducers/assignmentLists';
import departmentsReducer from '../reducers/departmentsList';
import unassignedfilesReducer from '../reducers/unassignedFiles';
import bulkAssignmentReducer from '../reducers/bulkAssignment';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    assignments: assignmentReducer,
    departments: departmentsReducer,
    unassignedFiles: unassignedfilesReducer,
    bulkAssignment: bulkAssignmentReducer,
  },
});
