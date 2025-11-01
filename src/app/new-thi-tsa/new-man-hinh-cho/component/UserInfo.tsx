interface UserInfoProps {
  name: string;
  id: string;
  accountStatus: string;
}

export default function UserInfo({ name, id, accountStatus }: UserInfoProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Họ và tên:</span>
        <span className="font-semibold text-gray-800">{name}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Mã định danh:</span>
        <span className="font-semibold text-gray-800">{id}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Trạng thái tài khoản</span>
        <span className="font-semibold text-green-600 italic">{accountStatus}</span>
      </div>
    </div>
  );
}
