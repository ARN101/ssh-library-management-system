import { Typography, Spin, Row, Col, Card, Button, Badge, Table } from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  useGetAllSeatsQuery,
  useUpdateSeatStatusMutation,
} from "../redux/features/seat/seatApi.js";
import { toast } from "sonner";

const { Title, Text } = Typography;

const SeatingMonitor = () => {
  const { data, isLoading } = useGetAllSeatsQuery(undefined, {
    pollingInterval: 10000,
  });
  const [updateSeat, { isLoading: isUpdating }] = useUpdateSeatStatusMutation();

  const seats = data?.data || [];
  const totalSeats = seats.length;
  const availableSeats = seats.filter((s) => s.status === "available").length;
  const occupied = seats.filter((s) => s.status === "taken");

  const handleFree = async (seat) => {
    try {
      await updateSeat({ id: seat.id, action: "free" }).unwrap();
      toast.success(`Seat ${seat.seat_number} freed`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to free seat");
    }
  };

  const columns = [
    {
      title: "Seat",
      dataIndex: "seat_number",
      key: "seat_number",
      width: 90,
      render: (n) => <Text strong>{n}</Text>,
    },
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <div>
          <Text>{record.user_name || "—"}</Text>
          {record.student_id && (
            <>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                ID: {record.student_id}
              </Text>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "user_email",
      key: "user_email",
      render: (email) => email || "—",
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          size="small"
          danger
          loading={isUpdating}
          onClick={() => handleFree(record)}
        >
          Free seat
        </Button>
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
        <Spin size="large" tip="Loading seating monitor..." />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          <EyeOutlined style={{ marginRight: 10, color: "#1677ff" }} />
          Seating Monitor
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Live view of reading room occupancy. Free a seat if needed.
        </Text>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: "#f6ffed" }}>
            <Title level={4} style={{ margin: 0, color: "#52c41a" }}>
              Available
            </Title>
            <Title level={2} style={{ margin: 0 }}>
              {availableSeats} / {totalSeats}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: "#fff2f0" }}>
            <Title level={4} style={{ margin: 0, color: "#ff4d4f" }}>
              Occupied
            </Title>
            <Title level={2} style={{ margin: 0 }}>
              {occupied.length}
            </Title>
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: 16, display: "flex", gap: 24 }}>
        <Badge color="#52c41a" text="Available" />
        <Badge color="#ff4d4f" text="Taken" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: 16,
          padding: 24,
          background: "#fafafa",
          borderRadius: 12,
          border: "1px solid #f0f0f0",
          marginBottom: 32,
        }}
      >
        {seats.map((seat) => {
          const isAvailable = seat.status === "available";
          const bgColor = isAvailable ? "#52c41a" : "#ff4d4f";

          return (
            <div
              key={seat.id}
              title={
                isAvailable
                  ? "Available"
                  : `${seat.user_name || "Occupied"} (${seat.student_id || "—"})`
              }
              style={{
                height: 80,
                borderRadius: 8,
                background: bgColor,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                {seat.seat_number}
              </Text>
              {isAvailable ? (
                <CheckCircleOutlined style={{ marginTop: 4 }} />
              ) : (
                <UserOutlined style={{ marginTop: 4 }} />
              )}
            </div>
          );
        })}
      </div>

      <Title level={4} style={{ marginBottom: 12 }}>
        Occupied seats
      </Title>
      <Table
        columns={columns}
        dataSource={occupied}
        rowKey="id"
        pagination={false}
        bordered
        locale={{ emptyText: "No seats are currently occupied." }}
      />
    </div>
  );
};

export default SeatingMonitor;
