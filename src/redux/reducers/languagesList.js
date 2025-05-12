import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {retrieveUser} from '../../storage/authData';

const fetchLanguageList = async () => {
  try {
    const user = await retrieveUser();
    if (!user?.token) {
      throw new Error('Token not found');
    }

    const response = await fetch(
      'https://staging.tangramerp.com/api-operation/languages',
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
    console.log('ooooooo', data);
    return data.languages;
  } catch (error) {
    throw error;
  }
};

export const fetchLanguages = createAsyncThunk(
  'languages/fetchLanguages',
  async (_, {rejectWithValue}) => {
    try {
      const rawLanguages = await fetchLanguageList();

      // Transform the nested structure: { Language: { id, language, abbrev } } → { id, language, abbrev }
      const transformed = rawLanguages.map(item => item.Language);
      console.log('ffffffff', transformed);
      return transformed;
    } catch (error) {
      return rejectWithValue(error.message || 'Language fetch failed');
    }
  },
);

const languageSlice = createSlice({
  name: 'languages',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLanguages.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default languageSlice.reducer;
