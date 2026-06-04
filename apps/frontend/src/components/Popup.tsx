type PopupType = "success" | "error" | "info";

export default function Popup({
  type,
  message,
  onClose,
}: {
  type: PopupType;
  message: string;
  onClose: () => void;
}) {
  if (!message) return null;

  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-slate-200 bg-white text-slate-800",
  }[type];

  return (
    <div className="fixed inset-x-0 top-5 z-50 mx-auto w-[92%] max-w-md">
      <div className={`rounded-2xl border px-5 py-4 shadow-xl ${styles}`}>
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-semibold leading-6">{message}</p>
          <button
            onClick={onClose}
            className="rounded-full px-2 text-lg font-bold leading-none hover:bg-black/10"
            type="button"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}