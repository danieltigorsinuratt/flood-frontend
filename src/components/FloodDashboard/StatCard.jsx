export default function StatCard({ label, value }) {
    return (
        <div className="overflow-hidden rounded-lg border border-black bg-white shadow-sm ring-1 ring-black/5">
            <div className="p-5">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-black">{value}</p>
            </div>
        </div>
    );
}
