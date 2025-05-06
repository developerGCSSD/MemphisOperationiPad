import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {retrieveUser} from '../../storage/authData';

// API call to fetch assignment data based on assignment_type
const fetchAssignmentList = async assignmentType => {
  try {
    const user = await retrieveUser();
    console.log('Retrieved user:', user.token);

    if (!user?.token) {
      console.error('❌ Token not found');
      throw new Error('Token not found');
    }

    const response = await axios.get(
      `https://staging.tangramerp.com/api-operation/assignments-list/${assignmentType}`,
      {
        headers: {
          JWToken: user.token,
          //   Authorization: `Bearer ${user.token}`,
        },
      },
    );

    console.log('✅ API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error.response ? error.response.data : 'Error fetching data';
  }
};

// Thunk to fetch the assignments list based on assignment_type
export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async (assignmentType, {rejectWithValue}) => {
    try {
      const data = await fetchAssignmentList(assignmentType);
      return data; // Return the fetched data
    } catch (error) {
      return rejectWithValue(error); // Return the error if failed
    }
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
        if (action.meta.arg === 'Leader') {
          state.leaders = action.payload;
        } else if (action.meta.arg === 'Guide') {
          state.guides = action.payload;
        }
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default assignmentsSlice.reducer;
