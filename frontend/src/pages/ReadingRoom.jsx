import { Typography, Spin, Row, Col, Card, Button, Badge } from "antd";
import { CoffeeOutlined, CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import {
  useGetAllSeatsQuery,
  useUpdateSeatStatusMutation,
} from "../redux/features/seat/seatApi.js";
import { useAppSelector } from "../redux/hooks.js";
import { selectCurrentUser } from "../redux/features/auth/authSlice.js";
import { toast } from "sonner";

const { Title, Text } = Typography;

const ReadingRoom = () => {
  const { data, isLoading } = useGetAllSeatsQuery(undefined, { pollingInterval: 10000 });
  const [updateSeat, { isLoading: isUpdating }] = useUpdateSeatStatusMutation();
  const user = useAppSelector(selectCurrentUser);

  const seats = data?.data || [];

  const handleSeatClick = async (seat) => {
    try {
      if (seat.status === "available") {
        await updateSeat({ id: seat.id, action: "take" }).unwrap();
        toast.success(`Seat ${seat.seat_number} booked successfully!`);
      } else if (
        seat.status === "taken" &&
        Number(seat.user_id) === Number(user?.id)
      ) {
        await updateSeat({ id: seat.id, action: "free" }).unwrap();
        toast.success(`Seat ${seat.seat_number} freed successfully!`);
      } else {
        toast.error("This seat is already taken by someone else.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update seat status");
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Spin size="large" tip="Loading seating plan..." />
      </div>
    );
  }

  // Calculate statistics
  const totalSeats = seats.length;
  const availableSeats = seats.filter(s => s.status === 'available').length;
  const mySeat = seats.find((s) => Number(s.user_id) === Number(user?.id));

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          <CoffeeOutlined style={{ marginRight: 10, color: "#1677ff" }} />
          Reading Room
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Book a seat in the quiet reading zone. You can book one seat at a time.
        </Text>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: "#f6ffed", borderColor: "#b7eb8f" }}>
            <Title level={4} style={{ margin: 0, color: "#52c41a" }}>Available Seats</Title>
            <Title level={2} style={{ margin: 0 }}>{availableSeats} / {totalSeats}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: "#e6f4ff", borderColor: "#91caff" }}>
            <Title level={4} style={{ margin: 0, color: "#1677ff" }}>Your Booking</Title>
            <Title level={2} style={{ margin: 0 }}>
              {mySeat ? mySeat.seat_number : "None"}
            </Title>
          </Card>
        </Col>
      </Row>

      {/* Legend */}
      <div style={{ marginBottom: 24, display: "flex", gap: 24 }}>
        <Badge color="#52c41a" text="Available" />
        <Badge color="#ff4d4f" text="Taken" />
        <Badge color="#1677ff" text="Your Seat" />
      </div>

      {/* Seat Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", 
        gap: 16,
        padding: 24,
        background: "#fafafa",
        borderRadius: 12,
        border: "1px solid #f0f0f0"
      }}>
        {seats.map((seat) => {
          const isMine = Number(seat.user_id) === Number(user?.id);
          const isAvailable = seat.status === "available";
          
          let bgColor = "#ff4d4f"; // taken
          let hoverColor = "#ff7875";
          
          if (isAvailable) {
            bgColor = "#52c41a";
            hoverColor = "#73d13d";
          } else if (isMine) {
            bgColor = "#1677ff";
            hoverColor = "#4096ff";
          }

          return (
            <Button
              key={seat.id}
              type="primary"
              style={{
                height: 80,
                borderRadius: 8,
                background: bgColor,
                borderColor: bgColor,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isMine ? "0 4px 12px rgba(22,119,255,0.3)" : "none",
                opacity: isUpdating ? 0.7 : 1,
              }}
              onClick={() => handleSeatClick(seat)}
              disabled={!isAvailable && !isMine}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                {seat.seat_number}
              </Text>
              {isMine && <UserOutlined style={{ color: "white", marginTop: 4 }} />}
              {isAvailable && <CheckCircleOutlined style={{ color: "white", marginTop: 4 }} />}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingRoom;
