'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "@/app/component/Navbar/Navbar";
import AutoCompleteDropdown from "@/app/component/AutoCompleteDropdown/AutoCompleteDropdown";
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

interface FormItemData {
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
  const formatThaiDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

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
    setEditStatesByPage({});
  };
  const [data, setData] = useState<FormItemData[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTable, setEditTable] = useState<FormItemData[]>([]);
  const [editStatesByPage, setEditStatesByPage] = useState<Record<number, FormItemData[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actualStartDate, setActualStartDate] = useState("");
  const [actualEndDate, setActualEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState<
    Array<{
      key: keyof FormItemData | "total";
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
    setEditStatesByPage({});
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
    const today = new Date().toISOString().split("T")[0];
    setNewRowData({
      date: today,
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
    } catch (err: unknown) {
      console.error("Add error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการเพิ่มข้อมูล";
      if (typeof err === "object" && err !== null) {
        const e = err as { response?: { status?: number; data?: { error?: string } }; message?: string };
        if (e.response?.status === 401) {
          errorMessage = "กรุณาเข้าสู่ระบบก่อนใช้งาน";
        } else if (e.response?.data?.error) {
          errorMessage = e.response.data.error;
        } else if (e.message) {
          errorMessage = e.message;
        }
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
    // เริ่มต้นสร้าง editStatesByPage สำหรับหน้าปัจจุบัน
    const currentPageEditState = JSON.parse(JSON.stringify(data));
    setEditTable(currentPageEditState);
    setEditStatesByPage(prev => ({
      ...prev,
      [page]: currentPageEditState
    }));
  };

  const handleSaveAll = async () => {
    try {
      setSaveLoading(true);
      
      // รวบรวมข้อมูลจากทุกหน้าใน editStatesByPage
      const allEditedData: FormItemData[] = [];
      Object.values(editStatesByPage).forEach(pageData => {
        allEditedData.push(...pageData);
      });
      
      // อัพเดทเฉพาะแถวที่มีการเปลี่ยนแปลงจริง
      const rowsToUpdate = allEditedData.filter(row => {
        if (row._deleted) return false;
        const original = data.find(o => o.id === row.id);
        if (!original) return true; // ถ้าไม่มีใน data ให้ถือว่าเปลี่ยน
        return (
          row.date !== original.date ||
          row.product_name !== original.product_name ||
          row.color !== original.color ||
          row.amount !== original.amount ||
          row.unit !== original.unit
        );
      });
      const rowsToDelete = allEditedData.filter(row => row._deleted);

      if (rowsToUpdate.length > 0) {
        console.log("Updating rows count:", rowsToUpdate.length);
        await Promise.all(
          rowsToUpdate.map((row, idx) => {
            console.log(`Patch #${idx + 1}:`, row);
            return axios.patch(`/api/form/${row.id}`, {
              date: row.date,
              product_name: row.product_name,
              color: row.color,
              amount: row.amount,
              unit: row.unit,
            });
          })
        );
        console.log("Rows updated successfully");
      }
      
      
      // ลบข้อมูล
      if (rowsToDelete.length > 0) {
        await Promise.all(
          rowsToDelete.map((row) => axios.delete(`/api/form/${row.id}`))
        );
      }

      setLoading(true);
      const response = await axios.get(
        `/api/form?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
          actualSearchQuery
        )}&topic=${selectedTopic}&startDate=${actualStartDate}&endDate=${actualEndDate}`
      );
      setData(response.data.data);
      setTotal(response.data.total || 0);
      
      // ออกจาก edit mode หลังจากรีเฟรชข้อมูลเสร็จแล้ว
      setIsEditMode(false);
      setEditTable([]);
      setEditStatesByPage({});

      // แสดง toast notification สำเร็จ
      showToastMessage("success", "บันทึกข้อมูลสำเร็จ!");
    } catch (err: unknown) {
      console.error("Save error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
      if (typeof err === "object" && err !== null) {
        const e = err as { response?: { status?: number; data?: { error?: string } }; message?: string };
        if (e.response?.status === 401) {
          errorMessage = "กรุณาเข้าสู่ระบบก่อนใช้งาน";
        } else if (e.response?.data?.error) {
          errorMessage = e.response.data.error;
        } else if (e.message) {
          errorMessage = e.message;
        }
      }
      showToastMessage("error", errorMessage);
    } finally {
      setSaveLoading(false);
      setLoading(false);
    }
  };

  const handleEditCell = (
    rowIdx: number,
    key: keyof FormItemData,
    value: string | number
  ) => {
    setEditTable((prev) => {
      const updated = prev.map((row, idx) => (idx === rowIdx ? { ...row, [key]: value } : row));
      // อัพเดท editStatesByPage สำหรับหน้าปัจจุบัน
      setEditStatesByPage(prevStates => ({
        ...prevStates,
        [page]: updated
      }));
      return updated;
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

  const handleSort = (key: keyof FormItemData | "total") => {
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

  const getSortIcon = (columnKey: keyof FormItemData | "total") => {
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
    const fetchData = async () => {
      if (!selectedTopic) {
        setData([]);
        setTotal(0);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/form?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
            actualSearchQuery
          )}&topic=${selectedTopic}&startDate=${actualStartDate}&endDate=${actualEndDate}`
        );
        setData(response.data.data);
        setTotal(response.data.total || 0);
        
        // ถ้าอยู่ใน edit mode ให้ตรวจสอบว่ามี edit state สำหรับหน้านี้หรือไม่
        if (isEditMode) {
          const existingEditState = editStatesByPage[page];
          if (existingEditState) {
            // ใช้ edit state ที่มีอยู่แล้ว (เก็บสถานะการลบไว้)
            setEditTable(existingEditState);
          } else {
            // สร้าง edit state ใหม่สำหรับหน้านี้
            const newEditState = JSON.parse(JSON.stringify(response.data.data));
            setEditTable(newEditState);
            setEditStatesByPage(prev => ({
              ...prev,
              [page]: newEditState
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, actualSearchQuery, actualStartDate, actualEndDate, selectedTopic, isEditMode]);

  const handleAddTopic = async (topicName: string) => {
    setAddTopicLoading(true);
    try {
      await axios.post("/api/topic", { name: topicName });
      // รีโหลดหัวข้อใหม่
      const topicsResponse = await axios.get("/api/topic");
      setTopics(topicsResponse.data.data);
      showToastMessage("success", "เพิ่มหัวข้อสำเร็จ!");
    } catch (err: unknown) {
      console.error("Add topic error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการเพิ่มหัวข้อ";
      if (typeof err === "object" && err !== null) {
        const e = err as { response?: { status?: number; data?: { error?: string } }; message?: string };
        if (e.response?.status === 401) {
          errorMessage = "กรุณาเข้าสู่ระบบก่อนเพิ่มหัวข้อ";
        } else if (e.response?.status === 409) {
          errorMessage = "หัวข้อนี้มีอยู่แล้ว";
        } else if (e.response?.data?.error) {
          errorMessage = e.response.data.error;
        } else if (e.message) {
          errorMessage = e.message;
        }
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
    } catch (err: unknown) {
      console.error("Edit topic error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการแก้ไขหัวข้อ";
      if (typeof err === "object" && err !== null) {
        const e = err as { response?: { status?: number; data?: { error?: string } }; message?: string };
        if (e.response?.status === 401) {
          errorMessage = "กรุณาเข้าสู่ระบบก่อนแก้ไขหัวข้อ";
        } else if (e.response?.status === 409) {
          errorMessage = "หัวข้อนี้มีอยู่แล้ว";
        } else if (e.response?.data?.error) {
          errorMessage = e.response.data.error;
        } else if (e.message) {
          errorMessage = e.message;
        }
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
    } catch (err: unknown) {
      console.error("Delete topic error:", err);
      let errorMessage = "เกิดข้อผิดพลาดในการลบหัวข้อ";
      if (typeof err === "object" && err !== null) {
        const e = err as { response?: { status?: number; data?: { error?: string } }; message?: string };
        if (e.response?.status === 401) {
          errorMessage = "กรุณาเข้าสู่ระบบก่อนลบหัวข้อ";
        } else if (e.response?.data?.error) {
          errorMessage = e.response.data.error;
        } else if (e.message) {
          errorMessage = e.message;
        }
      }
      showToastMessage("error", errorMessage);
    } finally {
      setDeleteTopicLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
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
          <div className="text-center">
    
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 sm:mb-4">
              Dashboard 
            </h1>
            <p className="text-slate-400 light:text-gray-700 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto transition-colors duration-300 px-4">
              จัดการข้อมูลสินค้าและคำสั่งซื้อ พร้อมระบบวิเคราะห์แบบเรียลไทม์
            </p>
            <div className="mt-4 sm:mt-6 flex justify-center">
              <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      วันที่
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
                      className="w-full bg-gray-800/80 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ชื่อสินค้า
                    </label>
                    {/* Custom AutoCompleteDropdown for product_name */}
                    <AutoCompleteDropdown
                      value={newRowData.product_name}
                      onChange={(val: string) => setNewRowData({ ...newRowData, product_name: val })}
                      options={Array.from(new Set(data.map(item => item.product_name).filter(Boolean)))}
                      placeholder="ระบุชื่อสินค้า"
                      maxLength={30}
                      className="shadow-lg focus-within:ring-2 focus-within:ring-blue-500"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {newRowData.product_name.length}/30 ตัวอักษร
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      สี
                    </label>
                    {/* Custom AutoCompleteDropdown for color */}
                    <AutoCompleteDropdown
                      value={newRowData.color}
                      onChange={(val: string) => setNewRowData({ ...newRowData, color: val })}
                      options={Array.from(new Set(data.map(item => item.color).filter(Boolean)))}
                      placeholder="ระบุสี"
                      maxLength={30}
                      className="shadow-lg focus-within:ring-2 focus-within:ring-blue-500"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {newRowData.color.length}/30 ตัวอักษร
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        จำนวน
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
                        className="w-full bg-gray-800/80 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        min="0"
                        max="999999999"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        หน่วย
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
                        className="w-full bg-gray-800/80 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        min="0"
                        max="999999999"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-800/80 rounded-lg p-3 border border-gray-600/50 backdrop-blur-sm">
                    <p className="text-sm text-gray-300">
                      รวม:{" "}
                      <span className="text-green-400 font-semibold">
                        {Math.floor(newRowData.amount * newRowData.unit)}
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
                total={isEditMode ? (() => {
                  // คำนวณจำนวนรายการที่ถูกลบในทุกหน้า
                  const totalDeleted = Object.values(editStatesByPage).reduce((sum, pageData) => {
                    return sum + pageData.filter(item => item._deleted).length;
                  }, 0);
                  return total - totalDeleted;
                })() : total} 
                page={page} 
                totalPages={isEditMode ? (() => {
                  // คำนวณจำนวนหน้าทั้งหมดตามจำนวนรายการที่เหลือ
                  const totalDeleted = Object.values(editStatesByPage).reduce((sum, pageData) => {
                    return sum + pageData.filter(item => item._deleted).length;
                  }, 0);
                  const effectiveTotal = total - totalDeleted;
                  return Math.ceil(effectiveTotal / pageSize);
                })() : totalPages} 
              />

              {/* แสดง DataTable เสมอเมื่ออยู่ใน edit mode หรือมีข้อมูล */}
              {(data.length > 0 || isEditMode ) ? (
                <>
                  <DataTable
                    data={data}
                    editTable={editTable}
                    isEditMode={isEditMode}
                    saveLoading={saveLoading}
                    sortConfig={sortConfig}
                    startDate={startDate}
                    endDate={endDate}
                    onSort={handleSort}
                    onEditAll={handleEditAll}
                    onSaveAll={handleSaveAll}
                    onCancelEdit={handleCancelEdit}
                    onAddRow={handleAddRow}
                    onEditCell={handleEditCell}
                    onDeleteRowInEditMode={id => {
                      setEditTable(prev => {
                        const updated = prev.map(item => 
                          item.id === id ? {...item, _deleted: true} : item
                        );
                        // อัพเดท editStatesByPage สำหรับหน้าปัจจุบัน
                        setEditStatesByPage(prevStates => ({
                          ...prevStates,
                          [page]: updated
                        }));
                        return updated;
                      });
                    }}
                    onAddToEditTable={item => {
                      setEditTable(prev => {
                        const updated = [...prev, item];
                        // อัพเดท editStatesByPage สำหรับหน้าปัจจุบัน
                        setEditStatesByPage(prevStates => ({
                          ...prevStates,
                          [page]: updated
                        }));
                        return updated;
                      });
                    }}
                    onStartDateChange={handleStartDateChange}
                    onEndDateChange={handleEndDateChange}
                    onApplyDateFilter={handleApplyDateFilter}
                    onClearDateFilter={handleClearDateFilter}
                    getSortIcon={getSortIcon}
                    setSortConfig={setSortConfig}
                  />

                  <Pagination
                    currentPage={page}
                    totalPages={isEditMode ? (() => {
                      // คำนวณจำนวนหน้าทั้งหมดตามจำนวนรายการที่เหลือ
                      const totalDeleted = Object.values(editStatesByPage).reduce((sum, pageData) => {
                        return sum + pageData.filter(item => item._deleted).length;
                      }, 0);
                      const effectiveTotal = total - totalDeleted;
                      return Math.ceil(effectiveTotal / pageSize);
                    })() : totalPages}
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
