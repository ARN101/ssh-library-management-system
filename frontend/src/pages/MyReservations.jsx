import { Table, Tag, Typography, Spin } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { useGetMyReservationsQuery } from "../redux/features/reservation/reservationApi.js";

const { Title, Text } = Typography;

const statusColorMap = {
  pending: "orange",
  issued: "blue",
  returned: "green",
  cancelled: "red",
};

const MyReservations = () => {
  const { data, isLoading } = useGetMyReservationsQuery();

  const reservations = data?.data || [];

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
      sorter: (a, b) =>
        new Date(a.reserved_at) - new Date(b.reserved_at),
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
          Track the status of your book reservation requests.
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
