import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {retrieveUser} from '../../storage/authData';

const fetchDepartmentList = async () => {
  try {
    const user = await retrieveUser();
    if (!user?.token || !user?.company_id) {
      throw new Error('Token or company_id not found');
    }

    const response = await fetch(
      `https://staging.tangramerp.com/api-operation/departments/${user.company_id}`,
      {
        method: 'GET',
        headers: {
          JWToken: user.token,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('Departments response:', data);
    return data.departments;
  } catch (error) {
    throw error;
  }
};

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, {rejectWithValue}) => {
    try {
      const rawDepartments = await fetchDepartmentList();

      // Transform from { Department: { id, name, default_lang } } → { id, name, default_lang }
      const transformed = rawDepartments.map(item => item.Department);
      console.log('Transformed departments:', transformed);
      return transformed;
    } catch (error) {
      return rejectWithValue(error.message || 'Department fetch failed');
    }
  },
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDepartments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default departmentSlice.reducer;
