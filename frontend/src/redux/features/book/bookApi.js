import { baseApi } from "../../api/baseApi";

export const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBooks: builder.query({
      query: () => ({
        url: "/books",
        method: "GET",
      }),
      providesTags: ["books"],
    }),
    addBook: builder.mutation({
      query: (bookData) => ({
        url: "/books",
        method: "POST",
        body: bookData,
      }),
      invalidatesTags: ["books"],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...bookData }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body: bookData,
      }),
      invalidatesTags: ["books"],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["books"],
    }),
  }),
});

export const {
  useGetAllBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookApi;
