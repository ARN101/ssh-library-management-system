import { useState, useMemo, useEffect } from "react";
import {
  Input,
  Select,
  Row,
  Col,
  Card,
  Tag,
  Typography,
  Spin,
  Empty,
  Badge,
  Space,
  Button,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  BookOutlined,
  UserOutlined,
  BarcodeOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useGetAllBooksQuery } from "../redux/features/book/bookApi.js";
import { useCreateReservationMutation } from "../redux/features/reservation/reservationApi.js";
import { resolveCoverSrc } from "../utils/coverUrl.js";
import { toast } from "sonner";

const { Title, Text } = Typography;
const { Meta } = Card;

const BookCover = ({ title, coverUrl }) => {
  const [failed, setFailed] = useState(false);
  const src = resolveCoverSrc(coverUrl);

  useEffect(() => {
    setFailed(false);
  }, [coverUrl]);

  if (!src || failed) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "linear-gradient(160deg, #1677ff 0%, #0958d9 100%)",
          color: "#fff",
          padding: 16,
          textAlign: "center",
        }}
      >
        <BookOutlined style={{ fontSize: 40 }} />
        <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      alt={`Cover of ${title}`}
      src={src}
      loading="lazy"
      style={{
        display: "block",
        width: "100%",
        height: 220,
        objectFit: "cover",
        background: "#e6f4ff",
      }}
      onError={() => setFailed(true)}
    />
  );
};

const BookCatalog = () => {
  const { data, isLoading } = useGetAllBooksQuery();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [reservingId, setReservingId] = useState(null);
  const [createReservation] = useCreateReservationMutation();

  const books = data?.data || [];

  const categories = useMemo(() => {
    const cats = [...new Set(books.map((b) => b.category).filter(Boolean))];
    return cats.sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        !searchText ||
        book.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchText.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || book.category === selectedCategory;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && book.is_available) ||
        (availabilityFilter === "unavailable" && !book.is_available);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [books, searchText, selectedCategory, availabilityFilter]);

  const handleReserve = async (bookId) => {
    setReservingId(bookId);
    try {
      await createReservation({ bookId }).unwrap();
      toast.success("Reservation submitted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reserve book");
    } finally {
      setReservingId(null);
    }
  };

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
        <Spin size="large" tip="Loading books..." />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 4 }}>
          <BookOutlined style={{ marginRight: 10, color: "#1677ff" }} />
          Book Catalog
        </Title>
        <Text type="secondary">
          Browse all available books in the SSH Library. Search by title,
          author, or ISBN.
        </Text>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        <Input
          placeholder="Search by title, author, or ISBN..."
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          size="large"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1, minWidth: 250 }}
        />
        <Select
          size="large"
          value={selectedCategory}
          onChange={setSelectedCategory}
          style={{ minWidth: 180 }}
          options={[
            { value: "all", label: "All Categories" },
            ...categories.map((cat) => ({ value: cat, label: cat })),
          ]}
        />
        <Select
          size="large"
          value={availabilityFilter}
          onChange={setAvailabilityFilter}
          style={{ minWidth: 170 }}
          options={[
            { value: "all", label: "All Availability" },
            { value: "available", label: "Available only" },
            { value: "unavailable", label: "Unavailable only" },
          ]}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          Showing {filteredBooks.length} of {books.length} books
        </Text>
      </div>

      {filteredBooks.length === 0 ? (
        <Empty
          description="No books found matching your search"
          style={{ marginTop: 60 }}
        />
      ) : (
        <Row gutter={[20, 20]}>
          {filteredBooks.map((book) => (
            <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
              <Badge.Ribbon
                text={book.is_available ? "Available" : "Unavailable"}
                color={book.is_available ? "green" : "red"}
              >
                <Card
                  hoverable
                  styles={{
                    body: {
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    },
                  }}
                  style={{
                    height: "100%",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  {/* Cover is inside the body so it always paints (Ant Card cover + flex was unreliable) */}
                  <div
                    data-testid="book-cover"
                    style={{
                      width: "100%",
                      height: 220,
                      overflow: "hidden",
                      background: "#f0f5ff",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <BookCover title={book.title} coverUrl={book.cover_url} />
                  </div>

                  <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                    <Meta
                      title={
                        <Text
                          strong
                          ellipsis={{ tooltip: book.title }}
                          style={{ fontSize: 16 }}
                        >
                          {book.title}
                        </Text>
                      }
                      description={
                        <Space
                          direction="vertical"
                          size={6}
                          style={{ width: "100%" }}
                        >
                          <Text type="secondary">
                            <UserOutlined style={{ marginRight: 6 }} />
                            {book.author}
                          </Text>

                          {book.isbn && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              <BarcodeOutlined style={{ marginRight: 6 }} />
                              {book.isbn}
                            </Text>
                          )}

                          <div style={{ marginTop: 8 }}>
                            {book.category && (
                              <Tag color="blue">{book.category}</Tag>
                            )}
                            <Tag color="default">Qty: {book.quantity ?? 0}</Tag>
                          </div>
                        </Space>
                      }
                    />

                    <div style={{ marginTop: 16 }}>
                      <Tooltip
                        title={
                          !book.is_available
                            ? "This book is currently unavailable"
                            : "Submit a reservation request"
                        }
                      >
                        <Button
                          type="primary"
                          icon={<SendOutlined />}
                          block
                          disabled={!book.is_available}
                          loading={reservingId === book.id}
                          onClick={() => handleReserve(book.id)}
                          style={{ borderRadius: 6 }}
                        >
                          Reserve
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BookCatalog;
