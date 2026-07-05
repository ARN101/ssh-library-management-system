import { useState, useMemo } from "react";
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
} from "antd";
import {
  SearchOutlined,
  BookOutlined,
  UserOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { useGetAllBooksQuery } from "../redux/features/book/bookApi.js";

const { Title, Text } = Typography;
const { Meta } = Card;

const BookCatalog = () => {
  const { data, isLoading } = useGetAllBooksQuery();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const books = data?.data || [];

  // Extract unique categories for the filter dropdown
  const categories = useMemo(() => {
    const cats = [...new Set(books.map((b) => b.category).filter(Boolean))];
    return cats.sort();
  }, [books]);

  // Filter books by search text and category
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        !searchText ||
        book.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchText.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [books, searchText, selectedCategory]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Spin size="large" tip="Loading books..." />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 4 }}>
          <BookOutlined style={{ marginRight: 10, color: "#1677ff" }} />
          Book Catalog
        </Title>
        <Text type="secondary">
          Browse all available books in the SSH Library. Search by title, author, or ISBN.
        </Text>
      </div>

      {/* Search & Filter Bar */}
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
          style={{ minWidth: 200 }}
          options={[
            { value: "all", label: "All Categories" },
            ...categories.map((cat) => ({ value: cat, label: cat })),
          ]}
        />
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          Showing {filteredBooks.length} of {books.length} books
        </Text>
      </div>

      {/* Book Cards Grid */}
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
                  style={{
                    height: "100%",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  {/* Book Icon Header */}
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px 0 16px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      margin: "-24px -24px 20px -24px",
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    <BookOutlined
                      style={{ fontSize: 48, color: "rgba(255,255,255,0.9)" }}
                    />
                  </div>

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
                      <Space direction="vertical" size={6} style={{ width: "100%" }}>
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
