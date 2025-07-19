import { useState } from "react";

interface Topic {
  id: string;
  name: string;
}

interface TopicManagerProps {
  topics: Topic[];
  selectedTopic: string;
  topicsLoading: boolean;
  user: { id: string; email: string } | null;
  onTopicChange: (topicId: string) => void;
  onAddTopic: (topicName: string) => Promise<void>;
  onEditTopic: (topicId: string, topicName: string) => Promise<void>;
  onDeleteTopic: (topicId: string) => Promise<void>;
  addTopicLoading: boolean;
  editTopicLoading: boolean;
  deleteTopicLoading: boolean;
}

const TopicManager: React.FC<TopicManagerProps> = ({
  topics,
  selectedTopic,
  topicsLoading,
  user,
  onTopicChange,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  addTopicLoading,
  editTopicLoading,
  deleteTopicLoading,
}) => {
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [showEditTopic, setShowEditTopic] = useState(false);
  const [showDeleteTopic, setShowDeleteTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [editTopicId, setEditTopicId] = useState("");
  const [editTopicName, setEditTopicName] = useState("");
  const [deleteTopicId, setDeleteTopicId] = useState("");
  const [deleteTopicName, setDeleteTopicName] = useState("");

  const openEditTopic = (topic: Topic) => {
    setEditTopicId(topic.id);
    setEditTopicName(topic.name);
    setShowEditTopic(true);
  };

  const openDeleteTopic = (topic: Topic) => {
    setDeleteTopicId(topic.id);
    setDeleteTopicName(topic.name);
    setShowDeleteTopic(true);
  };

  const handleAddTopic = async () => {
    if (newTopicName.trim()) {
      await onAddTopic(newTopicName.trim());
      setNewTopicName("");
      setShowAddTopic(false);
    }
  };

  const handleEditTopic = async () => {
    if (editTopicName.trim()) {
      await onEditTopic(editTopicId, editTopicName.trim());
      setEditTopicId("");
      setEditTopicName("");
      setShowEditTopic(false);
    }
  };

  const handleDeleteTopic = async () => {
    await onDeleteTopic(deleteTopicId);
    setDeleteTopicId("");
    setDeleteTopicName("");
    setShowDeleteTopic(false);
  };

  return (
    <>
      {/* Topic Selection */}
      <div className="mb-6">
        <div className="max-w-md mx-auto">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            เลือกหัวข้อ
          </label>
          {topicsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex">
                <div className="flex-1">
                  <select
                    value={selectedTopic}
                    onChange={(e) => onTopicChange(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent lightmode-select"
                  >
                    <option value="">เลือกหัวข้อ...</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {user && (
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-4 py-2 bg-blue-500/30 hover:bg-blue-500/60 backdrop-blur-md text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                    onClick={() => setShowAddTopic(true)}
                    type="button"
                  >
                    เพิ่มหัวข้อ
                  </button>
                  {selectedTopic && (
                    <>
                      <button
                        className="flex-1 px-4 py-2 bg-emerald-500/30 hover:bg-emerald-500/60 backdrop-blur-md text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg border border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        onClick={() => {
                          const topic = topics.find(t => t.id === selectedTopic);
                          if (topic) openEditTopic(topic);
                        }}
                        type="button"
                      >
                        แก้ไขหัวข้อ
                      </button>
                      <button
                        className="flex-1 px-4 py-2 bg-red-500/30 hover:bg-red-500/60 backdrop-blur-md text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg border border-red-400/30 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                        onClick={() => {
                          const topic = topics.find(t => t.id === selectedTopic);
                          if (topic) openDeleteTopic(topic);
                        }}
                        type="button"
                      >
                        ลบหัวข้อ
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal เพิ่มหัวข้อ */}
      {showAddTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">เพิ่มหัวข้อใหม่</h3>
            <input
              type="text"
              value={newTopicName}
              onChange={e => {
                const value = e.target.value;
                if (value.length <= 30) {
                  setNewTopicName(value);
                }
              }}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ชื่อหัวข้อ"
              maxLength={30}
              disabled={addTopicLoading}
            />
            <div className="text-xs text-gray-400 mb-4">
              {newTopicName.length}/30 ตัวอักษร
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gradient-to-r from-gray-600/80 to-gray-700/80 backdrop-blur-sm text-white rounded-lg hover:from-gray-700/90 hover:to-gray-800/90 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-500/30"
                onClick={() => setShowAddTopic(false)}
                type="button"
                disabled={addTopicLoading}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-blue-600/80 to-blue-700/80 backdrop-blur-sm text-white rounded-lg hover:from-blue-700/90 hover:to-blue-800/90 transition-all duration-200 shadow-lg hover:shadow-xl border border-blue-500/30 font-semibold"
                onClick={handleAddTopic}
                type="button"
                disabled={addTopicLoading}
              >
                {addTopicLoading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal แก้ไขหัวข้อ */}
      {showEditTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">แก้ไขหัวข้อ</h3>
            <input
              type="text"
              value={editTopicName}
              onChange={e => {
                const value = e.target.value;
                if (value.length <= 100) {
                  setEditTopicName(value);
                }
              }}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="ชื่อหัวข้อ"
              maxLength={30}
              disabled={editTopicLoading}
            />
            <div className="text-xs text-gray-400 mb-4">
              {editTopicName.length}/30 ตัวอักษร
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gradient-to-r from-gray-600/80 to-gray-700/80 backdrop-blur-sm text-white rounded-lg hover:from-gray-700/90 hover:to-gray-800/90 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-500/30"
                onClick={() => {
                  setShowEditTopic(false);
                  setEditTopicId("");
                  setEditTopicName("");
                }}
                type="button"
                disabled={editTopicLoading}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-emerald-600/80 to-emerald-700/80 backdrop-blur-sm text-white rounded-lg hover:from-emerald-700/90 hover:to-emerald-800/90 transition-all duration-200 shadow-lg hover:shadow-xl border border-emerald-500/30 font-semibold"
                onClick={handleEditTopic}
                type="button"
                disabled={editTopicLoading}
              >
                {editTopicLoading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ลบหัวข้อ */}
      {showDeleteTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">ลบหัวข้อ</h3>
            <p className="text-gray-300 mb-4">
              คุณต้องการลบหัวข้อ <span className="font-semibold text-white">&quot;{deleteTopicName}&quot;</span> หรือไม่?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gradient-to-r from-gray-600/80 to-gray-700/80 backdrop-blur-sm text-white rounded-lg hover:from-gray-700/90 hover:to-gray-800/90 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-500/30"
                onClick={() => {
                  setShowDeleteTopic(false);
                  setDeleteTopicId("");
                  setDeleteTopicName("");
                }}
                type="button"
                disabled={deleteTopicLoading}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-sm text-white rounded-lg hover:from-red-700/90 hover:to-red-800/90 transition-all duration-200 shadow-lg hover:shadow-xl border border-red-500/30 font-semibold"
                onClick={handleDeleteTopic}
                type="button"
                disabled={deleteTopicLoading}
              >
                {deleteTopicLoading ? "กำลังลบ..." : "ลบ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopicManager;
