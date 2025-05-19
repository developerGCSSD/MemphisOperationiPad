import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {retrieveUser} from '../../storage/authData';

const fetchUnassignedFilesFromAPI = async departmentId => {
  try {
    const user = await retrieveUser();

    if (!user?.token) {
      throw new Error('Token not found');
    }

    const response = await fetch(
      `https://staging.tangramerp.com/api-operation/unassigned-files/${departmentId}`,
      {
        method: 'GET',
        headers: {
          JWToken: user.token,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Raw unassigned files response:', data);

    // Transforming data
    const transformed = data.unassigned_files.map(item => ({
      id: item.OperationFile.id,
      file_no: item.OperationFile.file_no,
      request_id: item.OperationFile.request_id,
      arrival_date: item.Request.arrival_date,
      departure_date: item.Request.departure_date,
      department_id: item.Request.department_id,
      client_name: item.Client.name,
      department_name: item.Department.name,
    }));

    return transformed;
  } catch (error) {
    throw error;
  }
};

export const fetchUnassignedFiles = createAsyncThunk(
  'unassignedFiles/fetchUnassignedFiles',
  async (departmentId, {rejectWithValue}) => {
    try {
      const files = await fetchUnassignedFilesFromAPI(departmentId);
      return files;
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to fetch unassigned files',
      );
    }
  },
);

const unassignedFilesSlice = createSlice({
  name: 'unassignedFiles',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUnassignedFiles.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnassignedFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUnassignedFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default unassignedFilesSlice.reducer;
