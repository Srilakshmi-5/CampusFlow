"use client";

import React from "react";
import { useCampusStore } from "@/lib/store/campus-data-store";
import {
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ExamSurgeForecast() {
  const { examSchedule, isExamSpikeSimulated } = useCampusStore();

  return (
    <div className="rounded-2xl border bg-card p-5 md:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-600 text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Predictive Intelligence Engine
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Exam Week Crowd Surge Forecast
          </h3>
          <p className="text-xs text-muted-foreground">
            Anticipates high library traffic based on scheduled university examinations.
          </p>
        </div>

        {isExamSpikeSimulated && (
          <Badge variant="warning" className="self-start sm:self-auto gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulated Exam Rush Active (+35% Traffic)</span>
          </Badge>
        )}
      </div>

      {/* Exam Timeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {examSchedule.map((exam) => (
          <div
            key={exam.id}
            className="p-4 rounded-xl border bg-slate-50/70 dark:bg-slate-800/40 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-purple-500" />
                  {exam.exam_date}
                </span>
                <span className="font-semibold">{exam.start_time}</span>
              </div>

              <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                {exam.subject}
              </h5>
              <p className="text-[11px] text-muted-foreground truncate">
                {exam.department}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Enrolled Students:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {exam.student_count}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Surge Multiplier:</span>
                <span className="font-extrabold text-purple-600 dark:text-purple-400">
                  {exam.expected_crowd_multiplier}x Normal
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation alert */}
      <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
        <TrendingUp className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100">
            Intelligent Study Recommendation:
          </span>{" "}
          Computer Science & Business Administration students have major papers scheduled in 2–6 days.
          Zone A (Silent Pods) is projected to reach 100% capacity between 11:00 AM and 05:00 PM.
          Reserve your slot at least 24 hours in advance or utilize Zone B collaborative annexes.
        </div>
      </div>
    </div>
  );
}
