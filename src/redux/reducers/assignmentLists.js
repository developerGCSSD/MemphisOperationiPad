import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {retrieveUser} from '../../storage/authData';

// API call to fetch assignment data based on assignment_type using fetch
const fetchAssignmentList = async (assignmentType, departmentId) => {
  try {
    const user = await retrieveUser();
    console.log('Retrieved user:', user.token);
    console.log('Request Headers:', {
      JWToken: user.token,
    });
    console.log('type', assignmentType);
    console.log('departmentId', departmentId);

    if (!user?.token) {
      console.error('❌ Token not found');
      throw new Error('Token not found');
    }

    const response = await fetch(
      `https://staging.tangramerp.com/api-operation/assignments-list/${assignmentType}/${departmentId}`,
      {
        method: 'GET',
        headers: {
          JWToken: user.token,
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ API Error:', errorData);
      throw new Error(`HTTP ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', data);
    return data;
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    throw error;
  }
};

// Thunk to fetch the assignments list based on assignment_type anddepartmentId
export const fetchAssignments = createAsyncThunk(
  'assignments/fetch',
  async ({assignmentType, departmentId}, thunkAPI) => {
    const response = await fetchAssignmentList(assignmentType, departmentId);

    // Determine key based on assignmentType
    const key = assignmentType === 'Leader' ? 'Leaders List' : 'Guides List';
    const rawData = response[key];

    // Log to confirm
    console.log(`Fetched ${assignmentType}s:`, rawData);

    return {assignmentType, data: rawData};
  },
);

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState: {
    leaders: [],
    guides: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAssignments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;

        const transformedData = Object.entries(action.payload.data).map(
          ([id, name]) => ({id, name: name.trim()}),
        );

        const {assignmentType} = action.meta.arg;

        if (assignmentType === 'Leader') {
          state.leaders = transformedData;
        } else if (assignmentType === 'Guide') {
          state.guides = transformedData;
        }
      })

      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default assignmentsSlice.reducer;
