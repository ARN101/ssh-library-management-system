import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Tag,
  Space,
  Typography,
  Popconfirm,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  useGetAllBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} from "../redux/features/book/bookApi.js";
import { toast } from "sonner";

const { Title, Text } = Typography;

const BookInventory = () => {
  const { data, isLoading } = useGetAllBooksQuery();
  const [addBook, { isLoading: isAdding }] = useAddBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();

  const books = data?.data || [];

  // Open modal for adding a new book
  const handleAdd = () => {
    setEditingBook(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Open modal for editing an existing book
  const handleEdit = (record) => {
    setEditingBook(record);
    form.setFieldsValue({
      title: record.title,
      author: record.author,
      isbn: record.isbn,
      category: record.category,
      quantity: record.quantity,
    });
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteBook(id).unwrap();
      toast.success("Book deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete book");
    }
  };

  // Handle form submission (add or edit)
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingBook) {
        await updateBook({ id: editingBook.id, ...values }).unwrap();
        toast.success("Book updated successfully");
      } else {
        await addBook(values).unwrap();
        toast.success("Book added successfully");
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingBook(null);
    } catch (err) {
      if (err?.data?.message) {
        toast.error(err.data.message);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingBook(null);
  };

  // Table columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
      ellipsis: true,
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      sorter: (a, b) => (a.author || "").localeCompare(b.author || ""),
      ellipsis: true,
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
      responsive: ["md"],
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) =>
        category ? <Tag color="blue">{category}</Tag> : <Text type="secondary">—</Text>,
      filters: [
        ...new Set(books.map((b) => b.category).filter(Boolean)),
      ].map((cat) => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      width: 70,
      align: "center",
      sorter: (a, b) => (a.quantity || 0) - (b.quantity || 0),
    },
    {
      title: "Status",
      dataIndex: "is_available",
      key: "is_available",
      width: 110,
      align: "center",
      render: (isAvailable) => (
        <Tag color={isAvailable ? "green" : "red"}>
          {isAvailable ? "Available" : "Unavailable"}
        </Tag>
      ),
      filters: [
        { text: "Available", value: true },
        { text: "Unavailable", value: false },
      ],
      onFilter: (value, record) => record.is_available === value,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: "#1677ff" }}
          />
          <Popconfirm
            title="Delete this book?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Spin size="large" tip="Loading inventory..." />
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
            Book Inventory
          </Title>
          <Text type="secondary">
            Manage library books — add, edit, or remove entries.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleAdd}
          style={{
            borderRadius: 8,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
          }}
        >
          Add Book
        </Button>
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
            background: "#f6ffed",
            border: "1px solid #b7eb8f",
            borderRadius: 8,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>Total Books</Text>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#52c41a" }}>
            {books.length}
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
          <Text type="secondary" style={{ fontSize: 12 }}>Available</Text>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#1677ff" }}>
            {books.filter((b) => b.is_available).length}
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
          <Text type="secondary" style={{ fontSize: 12 }}>Unavailable</Text>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#fa541c" }}>
            {books.filter((b) => !b.is_available).length}
          </div>
        </div>
      </div>

      {/* Books Table */}
      <Table
        columns={columns}
        dataSource={books}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        bordered
        style={{ borderRadius: 8, overflow: "hidden" }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingBook ? "Edit Book" : "Add New Book"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingBook ? "Update" : "Add"}
        confirmLoading={isAdding || isUpdating}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the book title" }]}
          >
            <Input placeholder="e.g. Introduction to Algorithms" />
          </Form.Item>

          <Form.Item
            label="Author"
            name="author"
            rules={[{ required: true, message: "Please enter the author name" }]}
          >
            <Input placeholder="e.g. Thomas H. Cormen" />
          </Form.Item>

          <Form.Item
            label="ISBN"
            name="isbn"
          >
            <Input placeholder="e.g. 978-0-262-03384-8" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
          >
            <Input placeholder="e.g. Computer Science" />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 5" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookInventory;
