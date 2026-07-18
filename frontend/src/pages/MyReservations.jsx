import { Table, Tag, Typography, Spin, Button, Popconfirm } from "antd";
import { BookOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  useGetMyReservationsQuery,
  useUpdateReservationStatusMutation,
} from "../redux/features/reservation/reservationApi.js";
import { toast } from "sonner";

const { Title, Text } = Typography;

const statusColorMap = {
  pending: "orange",
  issued: "blue",
  returned: "green",
  cancelled: "red",
};

const MyReservations = () => {
  const { data, isLoading } = useGetMyReservationsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateReservationStatusMutation();

  const reservations = data?.data || [];

  const handleCancel = async (id) => {
    try {
      await updateStatus({ id, status: "cancelled" }).unwrap();
      toast.success("Reservation cancelled");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel reservation");
    }
  };

  const columns = [
    {
      title: "Book",
      key: "book",
      render: (_, record) => (
        <div>
          <Text strong>{record.book_title}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.book_author}
          </Text>
        </div>
      ),
    },
    {
      title: "Reserved At",
      dataIndex: "reserved_at",
      key: "reserved_at",
      render: (date) =>
        new Date(date).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      sorter: (a, b) => new Date(a.reserved_at) - new Date(b.reserved_at),
      defaultSortOrder: "descend",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => (
        <Tag
          color={statusColorMap[status] || "default"}
          style={{ textTransform: "capitalize", fontWeight: 500 }}
        >
          {status}
        </Tag>
      ),
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Issued", value: "issued" },
        { text: "Returned", value: "returned" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      align: "center",
      render: (_, record) =>
        record.status === "pending" ? (
          <Popconfirm
            title="Cancel this reservation?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleCancel(record.id)}
          >
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              loading={isUpdating}
            >
              Cancel
            </Button>
          </Popconfirm>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
  ];

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Spin size="large" tip="Loading your reservations..." />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 4 }}>
          <BookOutlined style={{ marginRight: 10, color: "#1677ff" }} />
          My Reservations
        </Title>
        <Text type="secondary">
          Track your requests. You can cancel pending reservations.
        </Text>
      </div>

      <Table
        columns={columns}
        dataSource={reservations}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        bordered
        style={{ borderRadius: 8, overflow: "hidden" }}
        locale={{ emptyText: "You haven't made any reservations yet." }}
      />
    </div>
  );
};

export default MyReservations;
