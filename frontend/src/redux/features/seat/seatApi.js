import { baseApi } from "../../api/baseApi";

export const seatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSeats: builder.query({
      query: () => ({
        url: "/seats",
        method: "GET",
      }),
      providesTags: ["seats"],
    }),
    updateSeatStatus: builder.mutation({
      query: ({ id, action }) => ({
        url: `/seats/${id}/status`,
        method: "PATCH",
        body: { action },
      }),
      invalidatesTags: ["seats"],
    }),
  }),
});

export const {
  useGetAllSeatsQuery,
  useUpdateSeatStatusMutation,
} = seatApi;
