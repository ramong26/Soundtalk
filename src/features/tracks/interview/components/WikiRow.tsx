import React from 'react';

export default function WikiRow({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <tr className="border-b-2 border-black">
      <th className="md:px-4 md:py-3 px-1 py-2 md:text-md text-sm font-bold text-black bg-[#FFD460] border-r-2 border-black w-1/4 uppercasetext-sm">
        {label}
      </th>
      <td className="px-4 py-3 text-black">
        {isLoading ? (
          <div className="w-full h-4 bg-neutral-300 rounded animate-pulse" />
        ) : (
          value || <span className="italic text-gray-600">정보 없음</span>
        )}
      </td>
    </tr>
  );
}
