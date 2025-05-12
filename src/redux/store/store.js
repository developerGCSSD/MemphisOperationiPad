import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../reducers/auth';
import assignmentReducer from '../reducers/assignmentLists';
import languageReducer from '../reducers/languagesList';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    assignments: assignmentReducer,
    languages: languageReducer,
  },
});
