export const EmptyMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col justify-center items-center h-36">
      <p className="text-2xl text-gray-500">{message}</p>
    </div>
  );
};
