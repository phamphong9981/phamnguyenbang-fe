import { SUBJECT_ID } from "@/hooks/useExam";
export type SubjectInfo = {
    id: number;
    name: string;
    dot: string;          // chấm màu
    text: string;         // text-color
    badge: string;        // chip nhạt
    border: string;       // viền nhạt
    gradient: string;     // from-.. to-..
};
export const getSubjectInfo = (subjectId: number): SubjectInfo => {
    switch (subjectId) {
        case SUBJECT_ID.MATH:
            return { id: subjectId, name: 'Toán học', dot: 'bg-blue-500', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-700', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' };
        case SUBJECT_ID.GEOGRAPHY:
            return { id: subjectId, name: 'Địa lý', dot: 'bg-green-500', text: 'text-green-600', badge: 'bg-green-50 text-green-700', border: 'border-green-200', gradient: 'from-green-500 to-green-600' };
        case SUBJECT_ID.LITERATURE:
            return { id: subjectId, name: 'Văn học', dot: 'bg-purple-500', text: 'text-purple-600', badge: 'bg-purple-50 text-purple-700', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600' };
        case SUBJECT_ID.HISTORY:
            return { id: subjectId, name: 'Lịch sử', dot: 'bg-orange-500', text: 'text-orange-600', badge: 'bg-orange-50 text-orange-700', border: 'border-orange-200', gradient: 'from-orange-500 to-orange-600' };
        case SUBJECT_ID.ENGLISH:
            return { id: subjectId, name: 'Tiếng Anh', dot: 'bg-indigo-500', text: 'text-indigo-600', badge: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600' };
        case SUBJECT_ID.PHYSICS:
            return { id: subjectId, name: 'Vật lý', dot: 'bg-red-500', text: 'text-red-600', badge: 'bg-red-50 text-red-700', border: 'border-red-200', gradient: 'from-red-500 to-red-600' };
        case SUBJECT_ID.CHEMISTRY:
            return { id: subjectId, name: 'Hóa học', dot: 'bg-yellow-500', text: 'text-yellow-600', badge: 'bg-yellow-50 text-yellow-700', border: 'border-yellow-200', gradient: 'from-yellow-500 to-yellow-600' };
        case SUBJECT_ID.BIOLOGY:
            return { id: subjectId, name: 'Sinh học', dot: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-600' };
        case SUBJECT_ID.SCIENCE:
            return { id: subjectId, name: 'Khoa học tự nhiên', dot: 'bg-cyan-500', text: 'text-cyan-600', badge: 'bg-cyan-50 text-cyan-700', border: 'border-cyan-200', gradient: 'from-cyan-500 to-cyan-600' };
        default:
            return { id: subjectId, name: 'Khác', dot: 'bg-gray-500', text: 'text-gray-700', badge: 'bg-gray-50 text-gray-700', border: 'border-gray-200', gradient: 'from-gray-500 to-gray-600' };
    }
};