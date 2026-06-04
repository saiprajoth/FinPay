export type TransactionProps = {
  amount: number;
  createdAt: Date;
  senderID?: number; // Fixed syntax for optional properties
  recipientID?: number; // Fixed syntax for optional properties
};

export default function TransactionBar({
  amount,
  createdAt,
  senderID,
}: TransactionProps) {
  // Formats the date cleanly (e.g., "31 May 2026, 03:03 am")
  const formattedDate = createdAt.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="mb-2 flex w-full items-center justify-between rounded-xl border-2 border-black px-6 py-3">
      {/* Fixed: Evaluated the template literal inside curly braces */}
      <div className="font-bold">Created at: {formattedDate}</div>

      <div className="flex items-center gap-4">
        {/* Spelling fix: changed 'recieved' to 'received' */}
        <div className="font-bold text-white bg-black px-2 py-1 rounded">
          {senderID ? "Sent" : "Received"}
        </div>

        <div className="font-bold text-white bg-black px-2 py-1 rounded">
          {amount}
        </div>
      </div>
    </div>
  );
}
