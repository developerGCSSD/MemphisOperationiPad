import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {retrieveUser} from '../../storage/authData';

export const sendBulkAssignment = createAsyncThunk(
  'bulkAssignment/send',
  async (body, {rejectWithValue}) => {
    try {
      const user = await retrieveUser();
      if (!user?.token) {
        throw new Error('Token not found');
      }

      const response = await fetch(
        'https://staging.tangramerp.com/api-operation/bulk-assignments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            JWToken: user.token,
          },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('fffffff', data, response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Bulk assignment failed');
    }
  },
);

const bulkAssignmentSlice = createSlice({
  name: 'bulkAssignment',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearBulkAssignmentState: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendBulkAssignment.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(sendBulkAssignment.fulfilled, state => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendBulkAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearBulkAssignmentState} = bulkAssignmentSlice.actions;
export default bulkAssignmentSlice.reducer;
