'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "@/app/component/Navbar/Navbar";
import { useAuth } from "@/app/context/useAuth";
import ConfirmPopup from "@/app/component/Popup/ConfirmPopup";
import FormPopup from "@/app/component/Popup/FormPopup";
import LoadingSpinner from "@/app/component/LoadingSpinner/LoadingSpinner";
import ToastNotification from "@/app/component/ToastNotification/ToastNotification";
import StatsCards from "@/app/component/StatsCards/StatsCards";
import SearchBar from "@/app/component/SearchBar/SearchBar";
import TopicManager from "@/app/component/TopicManager/TopicManager";
import DataTable from "@/app/component/DataTable/DataTable";
import Pagination from "@/app/component/Pagination/Pagination";
import EmptyState from "@/app/component/EmptyState/EmptyState";

// Configure axios to include credentials (cookies) with all requests
axios.defaults.withCredentials = true;

interface FormData {
  id: string;
  created_at: string;
  date: string;
  color: string;
  amount: number;
  unit: number;
  product_name: string;
  _deleted?: boolean;
}

interface TopicData {
  id: string;
  name: string;
}

export default function Dashboard() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { user } = useAuth();
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRowData, setNewRowData] = useState({
    date: "",
    product_name: "",
    color: "",
    amount: 0,
    unit: 0,
  });
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditTable([]);
    setEditModeTotal(0);
  };
  const [data, setData] = useState<FormData[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editModeTotal, setEditModeTotal] = useState(0); // จำนวนรายการในโหมดแก้ไข
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTable, setEditTable] = useState<FormData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actualStartDate, setActualStartDate] = useState("");
  const [actualEndDate, setActualEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState<
    Array<{
      key: keyof FormData | "total";
      direction: "asc" | "desc";
    }>
  >([]);
  const [showTopicChangeConfirm, setShowTopicChangeConfirm] = useState(false);
  const [pendingTopic, setPendingTopic] = useState<string>("");

  const [addTopicLoading, setAddTopicLoading] = useState(false);
  const [editTopicLoading, setEditTopicLoading] = useState(false);
  const [deleteTopicLoading, setDeleteTopicLoading] = useState(false);

  const showToastMessage = (type: "success" | "error", message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleTopicChange = (newTopic: string) => {
    // ถ้าอยู่ใน edit mode ให้แสดง confirmation popup
    if (isEditMode) {
      setPendingTopic(newTopic);
      setShowTopicChangeConfirm(true);
    } else {
      // ถ้าไม่อยู่ใน edit mode ให้เปลี่ยนหัวข้อได้ปกติ
      setSelectedTopic(newTopic);
      setPage(1);
      setSearchQuery("");
      setActualSearchQuery("");
      setStartDate("");
      setEndDate("");
      setActualStartDate("");
      setActualEndDate("");
    }
  };

  const confirmTopicChange = () => {
    // ออกจาก edit mode และเปลี่ยนหัวข้อ
    setIsEditMode(false);
    setEditTable([]);
    setSelectedTopic(pendingTopic);
    setPage(1);
    setSearchQuery("");
    setActualSearchQuery("");
    setStartDate("");
    setEndDate("");
    setActualStartDate("");
    setActualEndDate("");
    setShowTopicChangeConfirm(false);
    setPendingTopic("");
  };

  const cancelTopicChange = () => {
    setShowTopicChangeConfirm(false);
    setPendingTopic("");
  };

  const handleAddRow = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    setShowAddForm(true);
    setNewRowData({
      date: new Date().toISOString().split("T")[0],
      product_name: "",
      color: "",
      amount: 0,
      unit: 0,
    });
  };

  const handleSaveNewRow = async () => {
    if (!selectedTopic) {
      showToastMessage("error", "กรุณาเลือกหัวข้อก่อน");
      return;
    }

    if (!newRowData.product_name.trim()) {
      showToastMessage("error", "กรุณาระบุชื่อสินค้า");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/form", {
        ...newRowData,
        topic: selectedTopic,
      });

      // รีเฟรชข้อมูล
      const response = await axios.get(
        `/api/form?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
          actualSearchQuery
        )}&topic=${selectedTopic}&startDate=${actualStartDate}&endDate=${actualEndDate}`
      );
      setData(response.data.data);
      setTotal(response.data.total || 0);
      setShowAddForm(false);

      showToastMessage("success", "เพิ่มข้อมูลสำเร็จ!");
    } catch (err: any) {
      console.error("Add error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการเพิ่มข้อมูล";

      if (err.response?.status === 401) {
        errorMessage = "กรุณาเข้าสู่ระบบก่อนใช้งาน";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      showToastMessage("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRow = async (id: string) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    if (!confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/form/${id}`);

      // รีเฟรชข้อมูล
      const response = await axios.get(
        `/api/form?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
          actualSearchQuery
        )}&topic=${selectedTopic}&startDate=${actualStartDate}&endDate=${actualEndDate}`
      );
      setData(response.data.data);
      setTotal(response.data.total || 0);

      showToastMessage("success", "ลบข้อมูลสำเร็จ!");
    } catch (err: any) {
      console.error("Delete error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการลบข้อมูล";

      if (err.response?.status === 401) {
        errorMessage = "กรุณาเข้าสู่ระบบก่อนใช้งาน";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      showToastMessage("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAll = () => {
    if (isEditMode) return;
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    setIsEditMode(true);
    setEditTable(JSON.parse(JSON.stringify(data)));
    setEditModeTotal(total); // เก็บจำนวนรายการเดิม
  };

  const handleSaveAll = async () => {
    try {
      setSaveLoading(true);
      
      // หาข้อมูลที่ถูกลบออก (มีเครื่องหมาย _deleted)
      const deletedItems = editTable.filter(item => item._deleted);

      // ลบข้อมูลที่ถูกลบออก
      await Promise.all(
        deletedItems.map((item) => axios.delete(`/api/form/${item.id}`))
      );

      // อัปเดตข้อมูลที่เหลือ (ไม่รวมที่ถูกลบ)
      const itemsToUpdate = editTable.filter(row => !row._deleted);
      await Promise.all(
        itemsToUpdate.map((row) =>
          axios.patch(`/api/form/${row.id}`, {
            date: row.date,
            product_name: row.product_name,
            color: row.color,
            amount: row.amount,
            unit: row.unit,
          })
        )
      );

      setLoading(true);
      const response = await axios.get(
        `/api/form?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
          actualSearchQuery
        )}&topic=${selectedTopic}&startDate=${actualStartDate}&endDate=${actualEndDate}`
      );
      setData(response.data.data);
      setTotal(response.data.total || 0);
      setIsEditMode(false);
      setEditModeTotal(0);

      // แสดง toast notification สำเร็จ
      const deletedCount = deletedItems.length;
      const updatedCount = itemsToUpdate.length;
      let successMessage = "บันทึกข้อมูลสำเร็จ!";
      
      if (deletedCount > 0 && updatedCount > 0) {
        successMessage = `อัปเดต ${updatedCount} รายการ และลบ ${deletedCount} รายการสำเร็จ!`;
      } else if (deletedCount > 0) {
        successMessage = `ลบ ${deletedCount} รายการสำเร็จ!`;
      } else if (updatedCount > 0) {
        successMessage = `อัปเดต ${updatedCount} รายการสำเร็จ!`;
      }
      
      showToastMessage("success", successMessage);
    } catch (err: any) {
      console.error("Save error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการบันทึกข้อมูล";

      if (err.response?.status === 401) {
        errorMessage = "กรุณาเข้าสู่ระบบก่อนใช้งาน";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      showToastMessage("error", errorMessage);
    } finally {
      setSaveLoading(false);
      setLoading(false);
    }
  };

  const handleEditCell = (rowIdx: number, key: keyof FormData, value: any) => {
    setEditTable((prev) =>
      prev.map((row, idx) => (idx === rowIdx ? { ...row, [key]: value } : row))
    );
  };

  // ฟังก์ชันใหม่สำหรับลบข้อมูลใน edit mode (ลบเฉพาะใน frontend)
  const handleDeleteRowInEditMode = (id: string) => {
    setEditTable((prev) => {
      // แทนที่จะลบออก ให้ทำเครื่องหมายว่าถูกลบแล้ว
      const updated = prev.map(row => 
        row.id === id ? { ...row, _deleted: true } : row
      );
      
      // ถ้าไม่มีรายการนี้ใน editTable ให้เพิ่มเข้าไปพร้อมกับเครื่องหมายลบ
      if (!prev.find(row => row.id === id)) {
        const originalItem = data.find(item => item.id === id);
        if (originalItem) {
          updated.push({ ...originalItem, _deleted: true });
        }
      }
      
      return updated;
    });
    
    // อัปเดตจำนวนรายการทั้งหมดในโหมดแก้ไข
    const newEditModeTotal = editModeTotal - 1;
    setEditModeTotal(newEditModeTotal);
    
    // ถ้าหน้าปัจจุบันไม่มีข้อมูลแล้ว ให้ย้ายไปหน้าก่อนหน้า
    const newTotalPages = Math.ceil(newEditModeTotal / pageSize);
    if (page > newTotalPages && newTotalPages > 0) {
      setPage(newTotalPages);
    }
  };

  // ฟังก์ชันสำหรับเพิ่มข้อมูลเข้า editTable
  const handleAddToEditTable = (item: FormData) => {
    setEditTable((prev) => {
      if (!prev.find(row => row.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActualSearchQuery(searchQuery);
    setPage(1); // Reset to first page when searching
  };

  const handleApplyDateFilter = () => {
    setActualStartDate(startDate);
    setActualEndDate(endDate);
    setPage(1); // Reset to first page when filtering
  };

  const handleClearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setActualStartDate("");
    setActualEndDate("");
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleSort = (key: keyof FormData | "total") => {
    setSortConfig((prevConfig) => {
      // ถ้าไม่มี sort หรือเลือกคอลัมน์ใหม่ ให้เริ่มต้นใหม่
      if (prevConfig.length === 0 || prevConfig[0].key !== key) {
        return [{ key, direction: "asc" as const }];
      }
      // ถ้าเลือกคอลัมน์เดิม ให้สลับ asc/desc/remove
      const currentDirection = prevConfig[0].direction;
      if (currentDirection === "asc") {
        return [{ key, direction: "desc" as const }];
      }
      if (currentDirection === "desc") {
        return [];
      }
      return prevConfig;
    });
  };

  const getSortIcon = (columnKey: keyof FormData | "total") => {
    const sortItem = sortConfig.find((config) => config.key === columnKey);

    if (!sortItem) {
      return (
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    const sortIndex = sortConfig.findIndex(
      (config) => config.key === columnKey
    );
    const priorityNumber = sortIndex + 1;

    if (sortItem.direction === "asc") {
      return (
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          {sortConfig.length > 1 && (
            <span className="text-xs text-blue-400 font-bold">
              {priorityNumber}
            </span>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
            />
          </svg>
          {sortConfig.length > 1 && (
            <span className="text-xs text-blue-400 font-bold">
              {priorityNumber}
            </span>
          )}
        </div>
      );
    }
  };

  useEffect(() => {
    // โหลดข้อมูล topics
    const fetchTopics = async () => {
      try {
        const response = await axios.get("/api/topic");
        setTopics(response.data.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setTopicsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    // โหลดข้อมูล form เมื่อเลือก topic แล้ว
    if (!selectedTopic) {
      setData([]);
      setTotal(0);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/form?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
            actualSearchQuery
          )}&topic=${selectedTopic}&startDate=${actualStartDate}&endDate=${actualEndDate}`
        );
        setData(response.data.data);
        setTotal(response.data.total || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, actualSearchQuery, actualStartDate, actualEndDate, selectedTopic]);

  const handleAddTopic = async (topicName: string) => {
    setAddTopicLoading(true);
    try {
      await axios.post("/api/topic", { name: topicName });
      // รีโหลดหัวข้อใหม่
      const topicsResponse = await axios.get("/api/topic");
      setTopics(topicsResponse.data.data);
      showToastMessage("success", "เพิ่มหัวข้อสำเร็จ!");
    } catch (err: any) {
      console.error("Add topic error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการเพิ่มหัวข้อ";
      
      if (err.response?.status === 401) {
        errorMessage = "กรุณาเข้าสู่ระบบก่อนเพิ่มหัวข้อ";
      } else if (err.response?.status === 409) {
        errorMessage = "หัวข้อนี้มีอยู่แล้ว";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showToastMessage("error", errorMessage);
    } finally {
      setAddTopicLoading(false);
    }
  };

  const handleEditTopic = async (topicId: string, topicName: string) => {
    setEditTopicLoading(true);
    try {
      await axios.patch(`/api/topic/${topicId}`, { name: topicName });
      // รีโหลดหัวข้อใหม่
      const topicsResponse = await axios.get("/api/topic");
      setTopics(topicsResponse.data.data);
      showToastMessage("success", "แก้ไขหัวข้อสำเร็จ!");
    } catch (err: any) {
      console.error("Edit topic error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการแก้ไขหัวข้อ";
      
      if (err.response?.status === 401) {
        errorMessage = "กรุณาเข้าสู่ระบบก่อนแก้ไขหัวข้อ";
      } else if (err.response?.status === 409) {
        errorMessage = "หัวข้อนี้มีอยู่แล้ว";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showToastMessage("error", errorMessage);
    } finally {
      setEditTopicLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    setDeleteTopicLoading(true);
    try {
      await axios.delete(`/api/topic/${topicId}`);
      // รีโหลดหัวข้อใหม่
      const topicsResponse = await axios.get("/api/topic");
      setTopics(topicsResponse.data.data);
      // ถ้าหัวข้อที่ลบคือหัวข้อที่เลือกอยู่ ให้ reset
      if (selectedTopic === topicId) {
        setSelectedTopic("");
        setData([]);
        setTotal(0);
      }
      showToastMessage("success", "ลบหัวข้อสำเร็จ!");
    } catch (err: any) {
      console.error("Delete topic error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการลบหัวข้อ";
      
      if (err.response?.status === 401) {
        errorMessage = "กรุณาเข้าสู่ระบบก่อนลบหัวข้อ";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showToastMessage("error", errorMessage);
    } finally {
      setDeleteTopicLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 light:from-gray-100 light:via-gray-50 light:to-slate-100 transition-all duration-300 text-base md:text-lg">
      <Navbar />

      {/* Popup แจ้งเตือนเปลี่ยนหัวข้อ */}
      <ConfirmPopup
        isOpen={showTopicChangeConfirm}
        onClose={cancelTopicChange}
        onConfirm={confirmTopicChange}
        title="ยืนยันการเปลี่ยนหัวข้อ"
        message={
          <>
            การเปลี่ยนหัวข้อจะทำให้ข้อมูลที่กำลังแก้ไขหายไป
            <br />
            คุณต้องการดำเนินการต่อหรือไม่?
          </>
        }
        icon={
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        }
      />

      {/* Popup แจ้งเตือน login */}
      <ConfirmPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onConfirm={() => {
          setShowLoginPopup(false);
          // redirect จะเกิดขึ้นที่ component ConfirmPopup เมื่อมี redirectToLogin={true}
        }}
        title="เข้าสู่ระบบเพื่อแก้ไขข้อมูล"
        message="กรุณาเข้าสู่ระบบก่อนใช้งานฟีเจอร์นี้"
        confirmText="เข้าสู่ระบบ"
        cancelText="ปิด"
        redirectToLogin={true}
        icon={
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        }
        confirmButtonColor="blue"
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-12">
          {/* Header Section */}
          <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-4xl">📦</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">Dashboard</h1>
          <p className="text-slate-400 light:text-gray-700 text-xl max-w-2xl mx-auto transition-colors duration-300">จัดการข้อมูลสินค้าและคำสั่งซื้ออย่างมีประสิทธิภาพ</p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
          </div>

          {/* Topic Selection */}
          <TopicManager
            topics={topics}
            selectedTopic={selectedTopic}
            topicsLoading={topicsLoading}
            user={user}
            onTopicChange={handleTopicChange}
            onAddTopic={handleAddTopic}
            onEditTopic={handleEditTopic}
            onDeleteTopic={handleDeleteTopic}
            addTopicLoading={addTopicLoading}
            editTopicLoading={editTopicLoading}
            deleteTopicLoading={deleteTopicLoading}
          />

          {/* แสดง content ต่อไปเฉพาะเมื่อเลือก topic แล้ว */}
          {selectedTopic && (
            <>
              {/* Add Form Modal */}
              <FormPopup
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                onSubmit={handleSaveNewRow}
                title="เพิ่มข้อมูลใหม่"
                isLoading={loading}
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 light:text-neutral-700 mb-2">
                    <span className="text-base md:text-lg font-semibold">วันที่</span>
                    </label>
                    <input
                      type="date"
                      value={newRowData.date}
                      onChange={(e) =>
                        setNewRowData({
                          ...newRowData,
                          date: e.target.value,
                        })
                      }
                      className="w-full bg-gray-800/80 light:bg-gray-50/90 border border-gray-600/50 light:border-gray-300 rounded-xl px-4 py-3 text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm text-base md:text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-2">
                    <span className="text-base md:text-lg font-semibold">ชื่อสินค้า</span>
                    </label>
                    <input
                      type="text"
                      value={newRowData.product_name}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 30) {
                          setNewRowData({
                            ...newRowData,
                            product_name: value,
                          });
                        }
                      }}
                      className="w-full bg-gray-800/80 light:bg-gray-50/90 border border-gray-600/50 light:border-gray-300 rounded-xl px-4 py-3 text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm text-base md:text-lg"
                      placeholder="ระบุชื่อสินค้า"
                      maxLength={30}
                    />
                    <div className="text-xs text-gray-400 light:text-gray-600 mt-1">
                      <span className="text-sm md:text-base">{newRowData.product_name.length}/30 ตัวอักษร</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-2">
                    <span className="text-base md:text-lg font-semibold">สี</span>
                    </label>
                    <input
                      type="text"
                      value={newRowData.color}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 30) {
                          setNewRowData({
                            ...newRowData,
                            color: value,
                          });
                        }
                      }}
                      className="w-full bg-gray-800/80 light:bg-gray-50/90 border border-gray-600/50 light:border-gray-300 rounded-xl px-4 py-3 text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm text-base md:text-lg"
                      placeholder="ระบุสี"
                      maxLength={30}
                    />
                    <div className="text-xs text-gray-400 light:text-gray-600 mt-1">
                      <span className="text-sm md:text-base">{newRowData.color.length}/30 ตัวอักษร</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-2">
                        <span className="text-base md:text-lg font-semibold">จำนวนเงิน</span>
                      </label>
                      <input
                        type="number"
                        value={newRowData.amount === 0 ? "" : newRowData.amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = value === "" ? 0 : Number(value);
                          if (numValue >= 0 && numValue <= 999999999) {
                            setNewRowData({
                              ...newRowData,
                              amount: numValue,
                            });
                          }
                        }}
                        className="w-full bg-gray-800/80 light:bg-gray-50/90 border border-gray-600/50 light:border-gray-300 rounded-xl px-4 py-3 text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm text-base md:text-lg"
                        min="0"
                        max="999999999"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-2">
                        <span className="text-base md:text-lg font-semibold">หน่วย</span>
                      </label>
                      <input
                        type="number"
                        value={newRowData.unit === 0 ? "" : newRowData.unit}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = value === "" ? 0 : Number(value);
                          if (numValue >= 0 && numValue <= 999999999) {
                            setNewRowData({
                              ...newRowData,
                              unit: numValue,
                            });
                          }
                        }}
                        className="w-full bg-gray-800/80 light:bg-gray-50/90 border border-gray-600/50 light:border-gray-300 rounded-xl px-4 py-3 text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm text-base md:text-lg"
                        min="0"
                        max="999999999"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-800/80 light:bg-gray-100/80 rounded-lg p-3 border border-gray-600/50 light:border-gray-300 backdrop-blur-sm">
                    <p className="text-lg md:text-xl text-gray-300 light:text-gray-700 font-bold">
                      รวม:{" "}
                      <span className="text-green-400 light:text-green-600 font-extrabold">
                        {newRowData.amount * newRowData.unit}
                      </span>
                    </p>
                  </div>
                </div>
              </FormPopup>

              {/* Search Section */}
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSearch={handleSearch}
                onClear={() => {
                  setSearchQuery("");
                  setActualSearchQuery("");
                  setPage(1);
                }}
              />

              {/* Stats Cards */}
              <StatsCards 
              total={isEditMode ? editModeTotal : total} 
              page={page} 
              totalPages={isEditMode ? Math.ceil(editModeTotal / pageSize) : totalPages} 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              cardClassName="bg-gradient-to-br from-blue-500/20 to-blue-600/20 light:from-blue-50/80 light:to-blue-100/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 light:border-blue-200/70 shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
              valueClassName="text-3xl font-bold text-white light:text-gray-900 mt-1 transition-all duration-300"
              labelClassName="text-blue-300 light:text-blue-800 text-sm font-medium"
            />

              {(isEditMode ? editModeTotal > 0 : data.length > 0) ? (
                <>
                  <DataTable
                    data={data}
                    editTable={editTable}
                    isEditMode={isEditMode}
                    saveLoading={saveLoading}
                    sortConfig={sortConfig}
                    startDate={startDate}
                    endDate={endDate}
                    page={page}
                    pageSize={pageSize}
                    onSort={handleSort}
                    onEditAll={handleEditAll}
                    onSaveAll={handleSaveAll}
                    onCancelEdit={handleCancelEdit}
                    onAddRow={handleAddRow}
                    onEditCell={handleEditCell}
                    onDeleteRow={handleDeleteRow}
                    onDeleteRowInEditMode={handleDeleteRowInEditMode}
                    onStartDateChange={handleStartDateChange}
                    onEndDateChange={handleEndDateChange}
                    onApplyDateFilter={handleApplyDateFilter}
                    onClearDateFilter={handleClearDateFilter}
                    getSortIcon={getSortIcon}
                    setSortConfig={setSortConfig}
                    onAddToEditTable={handleAddToEditTable}
                  />

                  <Pagination
                    currentPage={page}
                    totalPages={isEditMode ? Math.ceil(editModeTotal / pageSize) : totalPages}
                    onPageChange={setPage}
                  />
                </>
              ) : (
                <EmptyState onAddData={handleAddRow} />
              )}
            </>
          )}
        </div>
      )}

      {/* Toast Notification */}
      <ToastNotification
        show={showToast}
        type={toastType}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
