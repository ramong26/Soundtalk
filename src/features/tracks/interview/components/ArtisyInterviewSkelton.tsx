export default function ArtisyInterviewSkelton() {
  return (
    <div
      className="animate-pulse flex gap-6 mb-6 p-6 bg-[#fffaf0] border-4 border-black rounded-md shadow-[4px_4px_0px_#000]"
      aria-hidden="true"
      role="status"
    >
      <div className="flex flex-col items-center justify-center text-center w-[100px]">
        <div className="w-16 h-16 bg-gray-300 rounded-full mb-2" />
        <div className="h-4 w-24 bg-gray-300 rounded mb-2" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center justify-between w-full gap-2 ">
        <div className="h-5 bg-gray-300 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded md:w-[100px] hidden mb-1" />
      </div>
    </div>
  );
}
