import { baseApi } from "../../api/baseApi";

export const reservationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReservation: builder.mutation({
      query: (data) => ({
        url: "/reservations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reservations", "books"],
    }),
    getAllReservations: builder.query({
      query: () => ({
        url: "/reservations",
        method: "GET",
      }),
      providesTags: ["reservations"],
    }),
    getMyReservations: builder.query({
      query: () => ({
        url: "/reservations/my",
        method: "GET",
      }),
      providesTags: ["reservations"],
    }),
    updateReservationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/reservations/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["reservations"],
    }),
  }),
});

export const {
  useCreateReservationMutation,
  useGetAllReservationsQuery,
  useGetMyReservationsQuery,
  useUpdateReservationStatusMutation,
} = reservationApi;
