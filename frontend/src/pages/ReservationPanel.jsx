import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Spin,
  Select,
  Popconfirm,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  useGetAllReservationsQuery,
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

const ReservationPanel = () => {
  const { data, isLoading } = useGetAllReservationsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateReservationStatusMutation();
  const [statusFilter, setStatusFilter] = useState("all");

  const reservations = data?.data || [];

  const filteredReservations =
    statusFilter === "all"
      ? reservations
      : reservations.filter((r) => r.status === statusFilter);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Reservation ${newStatus} successfully`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update reservation");
    }
  };

  const columns = [
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <div>
          <Text strong>{record.user_name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.user_email}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            ID: {record.student_id}
          </Text>
        </div>
      ),
    },
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
          {record.book_isbn && (
            <>
              <br />
              <Text type="secondary" style={{ fontSize: 11 }}>
                ISBN: {record.book_isbn}
              </Text>
            </>
          )}
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
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      align: "center",
      render: (_, record) => {
        const { status } = record;

        return (
          <Space wrap>
            {status === "pending" && (
              <Popconfirm
                title="Approve this reservation?"
                description="The book will be marked as issued to the student."
                onConfirm={() => handleStatusUpdate(record.id, "issued")}
                okText="Approve"
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  loading={isUpdating}
                  style={{ background: "#52c41a", borderColor: "#52c41a" }}
                >
                  Approve
                </Button>
              </Popconfirm>
            )}

            {status === "issued" && (
              <Popconfirm
                title="Mark as returned?"
                description="The book will be marked as returned by the student."
                onConfirm={() => handleStatusUpdate(record.id, "returned")}
                okText="Return"
              >
                <Button
                  size="small"
                  icon={<RollbackOutlined />}
                  loading={isUpdating}
                >
                  Return
                </Button>
              </Popconfirm>
            )}

            {(status === "pending" || status === "issued") && (
              <Popconfirm
                title="Cancel this reservation?"
                description="This action cannot be undone."
                onConfirm={() => handleStatusUpdate(record.id, "cancelled")}
                okText="Cancel"
                okType="danger"
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
            )}

            {(status === "returned" || status === "cancelled") && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                No actions available
              </Text>
            )}
          </Space>
        );
      },
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
        <Spin size="large" tip="Loading reservations..." />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0, marginBottom: 4 }}>
            <BookOutlined style={{ marginRight: 10, color: "#1677ff" }} />
            Reservation Management
          </Title>
          <Text type="secondary">
            Review, approve, and manage student book reservations.
          </Text>
        </div>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ minWidth: 160 }}
          size="large"
          options={[
            { value: "all", label: "All Statuses" },
            { value: "pending", label: "Pending" },
            { value: "issued", label: "Issued" },
            { value: "returned", label: "Returned" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: "12px 20px",
            background: "#fff7e6",
            border: "1px solid #ffd591",
            borderRadius: 8,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            Pending
          </Text>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#fa8c16" }}>
            {reservations.filter((r) => r.status === "pending").length}
          </div>
        </div>
        <div
          style={{
            padding: "12px 20px",
            background: "#e6f4ff",
            border: "1px solid #91caff",
            borderRadius: 8,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            Issued
          </Text>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#1677ff" }}>
            {reservations.filter((r) => r.status === "issued").length}
          </div>
        </div>
        <div
          style={{
            padding: "12px 20px",
            background: "#f6ffed",
            border: "1px solid #b7eb8f",
            borderRadius: 8,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            Returned
          </Text>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#52c41a" }}>
            {reservations.filter((r) => r.status === "returned").length}
          </div>
        </div>
        <div
          style={{
            padding: "12px 20px",
            background: "#fff2e8",
            border: "1px solid #ffbb96",
            borderRadius: 8,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            Cancelled
          </Text>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#fa541c" }}>
            {reservations.filter((r) => r.status === "cancelled").length}
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <Table
        columns={columns}
        dataSource={filteredReservations}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        bordered
        style={{ borderRadius: 8, overflow: "hidden" }}
      />
    </div>
  );
};

export default ReservationPanel;
