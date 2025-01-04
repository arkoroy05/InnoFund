import LoadingSkeleton from "@/components/PageLoading";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingSkeleton />
    </div>
  );
}