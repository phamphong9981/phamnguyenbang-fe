'use client';

import { useState, useCallback, useMemo } from 'react';
import { useGetUsers, useDelete } from '@/hooks/useAdmin';
import CreateUserModal from './CreateUserModal';

export default function UserManagement() {
    const [searchKey, setSearchKey] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // Query thực tế gửi lên API
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
    const [deleteUserName, setDeleteUserName] = useState<string>('');
    const itemsPerPage = 10;

    const { data: users, isLoading, error } = useGetUsers(searchQuery);
    const deleteMutation = useDelete();

    const filteredUsers = useMemo(() => users || [], [users]);
    const totalPages = useMemo(() => Math.ceil(filteredUsers.length / itemsPerPage), [filteredUsers.length, itemsPerPage]);
    const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);
    const endIndex = useMemo(() => startIndex + itemsPerPage, [startIndex, itemsPerPage]);
    const currentUsers = useMemo(() => filteredUsers.slice(startIndex, endIndex), [filteredUsers, startIndex, endIndex]);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchKey); // Chỉ gửi query khi submit
        setCurrentPage(1);
    }, [searchKey]);

    const handleSearchKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKey(e.target.value); // Chỉ cập nhật input value, không gọi API
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchKey('');
        setSearchQuery(''); // Clear cả search query
        setCurrentPage(1);
    }, []);

    const handleCreateSuccess = useCallback(() => {
        // Refresh the users list
        setCurrentPage(1);
    }, []);

    const handleDeleteClick = useCallback((userId: string, userName: string) => {
        setDeleteUserId(userId);
        setDeleteUserName(userName);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteUserId) return;

        try {
            await deleteMutation.mutateAsync(deleteUserId);
            setDeleteUserId(null);
            setDeleteUserName('');
            setCurrentPage(1); // Reset to first page
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }, [deleteUserId, deleteMutation]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteUserId(null);
        setDeleteUserName('');
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getPremiumStatus = (expiredAt: string) => {
        const now = new Date();
        const expired = new Date(expiredAt);
        const isExpired = now > expired;

        return {
            isExpired,
            status: isExpired ? 'Hết hạn' : 'Còn hạn',
            color: isExpired ? 'text-red-600' : 'text-green-600'
        };
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải danh sách người dùng...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Quản lý tài khoản người dùng
                        </h2>
                        <p className="text-gray-600">
                            Tổng cộng {filteredUsers.length} tài khoản
                            {searchQuery && (
                                <span className="ml-2 text-green-600">
                                    (kết quả tìm kiếm cho "{searchQuery}")
                                </span>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 self-start sm:self-auto"
                    >
                        <span>➕</span>
                        Tạo tài khoản
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, username, lớp..."
                            value={searchKey}
                            onChange={handleSearchKeyChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        🔍 Tìm kiếm
                    </button>
                    {(searchKey || searchQuery) && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                        >
                            ✕ Xóa bộ lọc
                        </button>
                    )}
                </form>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thông tin
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lớp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Năm sinh
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Premium
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentUsers.map((user) => {
                                const premiumStatus = getPremiumStatus(user.premiumExpiredAt);

                                return (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-green-600 font-semibold text-sm">
                                                        {user.fullname.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.fullname}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        @{user.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {user.class}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.yearOfBirth}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-medium ${premiumStatus.color}`}>
                                                    {premiumStatus.status}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(user.premiumExpiredAt)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button className="text-green-600 hover:text-green-900 transition-colors">
                                                    ✏️ Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(user.id, user.fullname)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                >
                                                    🗑️ Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {currentUsers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-4xl mb-4">👥</div>
                        <p className="text-gray-500">
                            {searchQuery ? 'Không tìm thấy người dùng nào' : 'Chưa có người dùng nào'}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                        Hiển thị {startIndex + 1} đến {Math.min(endIndex, filteredUsers.length)} trong tổng số {filteredUsers.length} kết quả
                    </div>
                    <div className="flex items-center space-x-1 overflow-x-auto max-w-full">
                        {/* Previous Button */}
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            ← Trước
                        </button>

                        {/* Page Numbers */}
                        {(() => {
                            const maxVisiblePages = 5;
                            const halfVisible = Math.floor(maxVisiblePages / 2);
                            let startPage = Math.max(1, currentPage - halfVisible);
                            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                            // Adjust start page if we're near the end
                            if (endPage - startPage + 1 < maxVisiblePages) {
                                startPage = Math.max(1, endPage - maxVisiblePages + 1);
                            }

                            const pages = [];

                            // First page and ellipsis
                            if (startPage > 1) {
                                pages.push(
                                    <button
                                        key={1}
                                        onClick={() => setCurrentPage(1)}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        1
                                    </button>
                                );
                                if (startPage > 2) {
                                    pages.push(
                                        <span key="ellipsis1" className="px-2 text-gray-500">
                                            ...
                                        </span>
                                    );
                                }
                            }

                            // Visible pages
                            for (let i = startPage; i <= endPage; i++) {
                                pages.push(
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${currentPage === i
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {i}
                                    </button>
                                );
                            }

                            // Last page and ellipsis
                            if (endPage < totalPages) {
                                if (endPage < totalPages - 1) {
                                    pages.push(
                                        <span key="ellipsis2" className="px-2 text-gray-500">
                                            ...
                                        </span>
                                    );
                                }
                                pages.push(
                                    <button
                                        key={totalPages}
                                        onClick={() => setCurrentPage(totalPages)}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        {totalPages}
                                    </button>
                                );
                            }

                            return pages;
                        })()}

                        {/* Next Button */}
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            Sau →
                        </button>
                    </div>
                </div>
            )}

            {/* Create User Modal */}
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {/* Delete Confirmation Modal */}
            {deleteUserId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-red-600 text-xl">⚠️</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Xác nhận xóa tài khoản
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Hành động này không thể hoàn tác
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-700">
                                    Bạn có chắc chắn muốn xóa tài khoản của{' '}
                                    <span className="font-semibold text-red-600">{deleteUserName}</span>?
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Tất cả dữ liệu liên quan đến tài khoản này sẽ bị xóa vĩnh viễn.
                                </p>
                            </div>

                            {deleteMutation.isError && (
                                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-center">
                                        <div className="text-red-400 mr-2">⚠️</div>
                                        <p className="text-red-700 text-sm">
                                            Có lỗi xảy ra khi xóa tài khoản. Vui lòng thử lại.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={handleDeleteCancel}
                                    disabled={deleteMutation.isPending}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleteMutation.isPending}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deleteMutation.isPending ? (
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Đang xóa...
                                        </div>
                                    ) : (
                                        '🗑️ Xóa tài khoản'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
