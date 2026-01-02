"use client"

import { useState } from "react"
import { MapPin, Trash2, Weight, Calendar, Clock, CheckCircle, ArrowRight, Eye } from "lucide-react"

interface Task {
  id?: number
  location: string
  status: "pending" | "in_progress" | "verified"
  wasteType: string
  amount?: string
  createdAt?: Date
  collectorId?: string
}

interface TaskCardProps {
  task: Task
  userId?: string
  onViewDetails?: (id: string) => void
  onStartCollection?: (id: string) => void
  onComplete?: (task: Task) => void
}

function getDaysAgo(date: Date): string | number {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Hari ini"
  if (diffDays === 1) return "Kemarin"
  return diffDays
}

export function TaskCard({ task, userId, onViewDetails, onStartCollection, onComplete }: TaskCardProps) {
  const [hoveredWasteType, setHoveredWasteType] = useState<string | null>(null)

  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl border-2 border-gray-200 shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-emerald-400 hover:-translate-y-2">
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-green-500/0 group-hover:from-emerald-500/5 group-hover:to-green-500/5 transition-all duration-500 pointer-events-none" />

      {/* Header with animated background */}
      <div className="relative overflow-hidden p-5 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-b-2 border-emerald-100">
        {/* Animated MapPin icons background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="absolute whitespace-nowrap"
              style={{
                top: `${row * 35}%`,
                animation: `scroll-left ${14 + row * 3}s linear infinite`,
              }}
            >
              <div className="inline-flex gap-8">
                {Array.from({ length: 20 }).map((_, i) => (
                  <MapPin
                    key={i}
                    className="text-emerald-400/20"
                    style={{
                      width: `${14 + (i % 3) * 4}px`,
                      height: `${14 + (i % 3) * 4}px`,
                      transform: `rotate(${-15 + (i % 5) * 8}deg)`,
                    }}
                  />
                ))}
              </div>
              <div className="inline-flex gap-8">
                {Array.from({ length: 20 }).map((_, i) => (
                  <MapPin
                    key={`dup-${i}`}
                    className="text-emerald-400/20"
                    style={{
                      width: `${14 + (i % 3) * 4}px`,
                      height: `${14 + (i % 3) * 4}px`,
                      transform: `rotate(${-15 + (i % 5) * 8}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
            50% { box-shadow: 0 0 12px 4px rgba(234, 179, 8, 0.3); }
          }
        `}</style>

        <div className="relative flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-200 to-green-100 rounded-xl shadow-md border border-emerald-300/50 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-5 h-5 text-emerald-700" />
            </div>
            <a
              href={task.location}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-600 text-base cursor-pointer hover:text-emerald-700 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-500 hover:after:w-full after:transition-all after:duration-300"
            >
              Lihat Lokasi
            </a>
          </div>

          {/* Enhanced status badge with pulse animation for pending */}
          <span
            className={`rounded-xl px-4 py-2 text-sm font-bold shadow-lg backdrop-blur-sm ${
              task.status === "pending"
                ? "bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 border-2 border-amber-300"
                : task.status === "in_progress"
                  ? "bg-gradient-to-r from-blue-100 to-sky-200 text-blue-800 border-2 border-blue-300"
                  : "bg-gradient-to-r from-emerald-100 to-green-200 text-emerald-800 border-2 border-emerald-300"
            }`}
            style={task.status === "pending" ? { animation: "pulse-glow 2s ease-in-out infinite" } : {}}
          >
            {task.status === "pending" && (
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Menunggu
              </span>
            )}
            {task.status === "in_progress" && "Sedang Berlangsung"}
            {task.status === "verified" && "Terverifikasi"}
          </span>
        </div>
      </div>

      {/* Content section with enhanced info cards */}
      <div className="relative p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Jenis Sampah */}
          <div className="group/card flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-200 group-hover/card:border-emerald-200 transition-colors">
              <Trash2 className="w-5 h-5 text-gray-600 group-hover/card:text-emerald-600 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Jenis Sampah</div>
              <div className="relative">
                <span
                  onMouseEnter={() => setHoveredWasteType(task.wasteType)}
                  onMouseLeave={() => setHoveredWasteType(null)}
                  className="block text-sm font-bold text-gray-900 cursor-pointer line-clamp-2"
                  title={task.wasteType}
                >
                  {task.wasteType}
                </span>
                {hoveredWasteType === task.wasteType && (
                  <div className="absolute left-0 top-full z-10 p-3 mt-2 text-sm text-white bg-gray-900 rounded-xl shadow-2xl whitespace-normal max-w-[250px] border border-gray-700">
                    {task.wasteType}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Perkiraan Berat */}
          <div className="group/card flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-200 group-hover/card:border-emerald-200 transition-colors">
              <Weight className="w-5 h-5 text-gray-600 group-hover/card:text-emerald-600 transition-colors" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Perkiraan Berat</div>
              <div className="text-sm font-bold text-gray-900">{task.amount || "N/A"}</div>
            </div>
          </div>

          {/* Tanggal Lapor */}
          <div className="group/card flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-200 group-hover/card:border-emerald-200 transition-colors">
              <Calendar className="w-5 h-5 text-gray-600 group-hover/card:text-emerald-600 transition-colors" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Tanggal Lapor</div>
              <div className="text-sm font-bold text-gray-900">
                {task.createdAt
                  ? task.createdAt.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "No date"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with gradient divider */}
        <div className="relative pt-5">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50/50 px-3 py-1.5 rounded-full border border-blue-100">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-medium">
                {task.createdAt && (
                  <>
                    {typeof getDaysAgo(task.createdAt) === "string"
                      ? getDaysAgo(task.createdAt)
                      : `${getDaysAgo(task.createdAt)} hari yang lalu`}
                  </>
                )}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {task.status === "pending" && (
                <>
                  <button
                    onClick={() => onViewDetails?.(task.id?.toString() || "")}
                    className="flex items-center justify-center gap-2 flex-1 sm:flex-initial rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-600 border-2 border-emerald-500 hover:bg-emerald-50 hover:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Eye className="w-4 h-4" />
                    Lihat Detail
                  </button>
                  <button
                    onClick={() => onStartCollection?.(task.id?.toString() || "")}
                    className="flex items-center justify-center gap-2 flex-1 sm:flex-initial rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Mulai Pengumpulan
                  </button>
                </>
              )}
              {task.status === "in_progress" && task.collectorId === userId && (
                <button
                  onClick={() => onComplete?.(task)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Selesai & Verifikasi
                </button>
              )}
              {task.status === "in_progress" && task.collectorId !== userId && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <span className="text-sm font-bold text-amber-800">Sedang dikerjakan</span>
                </div>
              )}
              {task.status === "verified" && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl border-2 border-emerald-300 shadow-md">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">Hadiah Diterima</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
