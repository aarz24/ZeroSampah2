"use client"

// =============================================================================
// EVENT CARD COMPONENT - Beautified Version
// =============================================================================
// This component displays a single event card with the following features:
// - Visual status badges: upcoming (amber), active (green), completed (gray)
// - Video preview on hover (if video exists)
// - Animated hover effects and transitions
// - Google Maps link for location (if coordinates exist)
// =============================================================================

import { useState, useRef } from "react"
import Link from "next/link"

// -----------------------------------------------------------------------------
// TYPE DEFINITION
// -----------------------------------------------------------------------------
type EventWithOrganizer = {
    event: {
        id: number
        title: string
        description: string | null
        location: string
        latitude: string | null
        longitude: string | null
        eventDate: Date | null | string
        eventTime: string
        wasteCategories: string[] | null
        rewardInfo: string | null
        status: string
        maxParticipants: number | null
        images: string[] | null
        videos: string[] | null
    }
    organizer: {
        fullName: string | null
        email: string
    } | null
}

// -----------------------------------------------------------------------------
// COMPONENT PROPS
// -----------------------------------------------------------------------------
type EventCardProps = {
    ev: EventWithOrganizer
}

export default function EventCard({ ev }: EventCardProps) {
    // ---------------------------------------------------------------------------
    // STATE FOR VIDEO PREVIEW
    // ---------------------------------------------------------------------------
    const [isPlaying, setIsPlaying] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    // ---------------------------------------------------------------------------
    // FORMAT EVENT DATE
    // ---------------------------------------------------------------------------
    // Converts database date to readable format: "15 Feb 2026"
    const eventDate = ev.event.eventDate
        ? new Date(ev.event.eventDate).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "-"

    // ---------------------------------------------------------------------------
    // CHECK IF LOCATION HAS COORDINATES FOR MAP LINK
    // ---------------------------------------------------------------------------
    const hasLocation = ev.event.latitude && ev.event.longitude

    // ---------------------------------------------------------------------------
    // GET FIRST VIDEO URL FOR PREVIEW (if any videos exist)
    // ---------------------------------------------------------------------------
    const videoUrl = ev.event.videos && ev.event.videos.length > 0 ? ev.event.videos[0] : null

    // ---------------------------------------------------------------------------
    // VIDEO HOVER HANDLERS
    // ---------------------------------------------------------------------------
    const handlePlay = () => {
        setIsPlaying(true)
        if (videoRef.current) {
            const playPromise = videoRef.current.play()
            if (playPromise !== undefined) {
                playPromise.catch(() => { }) // Ignore autoplay errors
            }
        }
    }

    const handlePause = () => {
        setIsPlaying(false)
        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }

    // ---------------------------------------------------------------------------
    // STATUS BADGE COLOR LOGIC
    // ---------------------------------------------------------------------------
    // upcoming = amber/yellow badge
    // active = green badge
    // completed = gray badge
    const statusColor =
        ev.event.status === "active" ? "bg-emerald-500" : ev.event.status === "upcoming" ? "bg-amber-500" : "bg-gray-400"

    // ---------------------------------------------------------------------------
    // RENDER CARD
    // ---------------------------------------------------------------------------
    return (
        <div
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50/80 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2"
            onMouseEnter={handlePlay}
            onMouseLeave={handlePause}
        >
            {/* ------------------------------------------------------------------- */}
            {/* DECORATIVE CORNER ACCENT - Blurred gradient circle */}
            {/* ------------------------------------------------------------------- */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

            {/* ------------------------------------------------------------------- */}
            {/* VIDEO PREVIEW LAYER - Shows on hover if video exists */}
            {/* ------------------------------------------------------------------- */}
            {videoUrl && (
                <div
                    className={`absolute inset-0 z-0 transition-opacity duration-500 ${isPlaying ? "opacity-100" : "opacity-0"}`}
                >
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay so text remains readable over video */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TOP ACCENT BAR - Animated gradient with shimmer effect */}
            {/* ------------------------------------------------------------------- */}
            <div className="relative h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 overflow-hidden">
                {/* Shimmer animation on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* CLICKABLE LINK OVERLAY - Makes entire card clickable */}
            {/* ------------------------------------------------------------------- */}
            <Link href={`/events/${ev.event.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View Event Details</span>
            </Link>

            {/* ------------------------------------------------------------------- */}
            {/* MAIN CARD CONTENT */}
            {/* ------------------------------------------------------------------- */}
            <div className="relative z-20 p-5 pointer-events-none">
                {/* STATUS BADGE & VIDEO INDICATOR ROW */}
                <div className="flex items-center justify-between mb-4">
                    {/* Status badge with pulsing dot */}
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${statusColor} shadow-sm`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                        {ev.event.status.charAt(0).toUpperCase() + ev.event.status.slice(1)}
                    </span>

                    {/* Video preview indicator (only shows if video exists) */}
                    {videoUrl && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-gray-500 bg-gray-100/80 backdrop-blur-sm">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Preview
                        </span>
                    )}
                </div>

                {/* EVENT TITLE */}
                <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300 leading-snug">
                    {ev.event.title}
                </h3>

                {/* INFO CARDS SECTION */}
                <div className="space-y-2.5">
                    {/* DATE & TIME INFO CARD */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100/50">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-sm">
                            {/* Calendar icon */}
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Date & Time</p>
                            <p className="text-sm font-semibold text-gray-800">
                                {eventDate} • {ev.event.eventTime}
                            </p>
                        </div>
                    </div>

                    {/* LOCATION INFO CARD */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50/50 border border-gray-100/50">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-sm flex-shrink-0">
                            {/* Location pin icon */}
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">Location</p>
                            <p className="text-sm font-semibold text-gray-800 line-clamp-1">{ev.event.location}</p>
                            {/* Google Maps link - only shows if lat/lng exist */}
                            {hasLocation && (
                                <a
                                    href={`https://maps.google.com/?q=${ev.event.latitude},${ev.event.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-semibold mt-1 pointer-events-auto relative z-30 group/link"
                                >
                                    View on Maps
                                    <svg
                                        className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* FOOTER - Organizer name & View Details CTA */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">{ev.organizer?.fullName || "Anonymous"}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:gap-2 transition-all duration-300">
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    )
}
