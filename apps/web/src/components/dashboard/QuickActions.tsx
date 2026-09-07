"use client";

import {
  CalendarPlus,
  MessageSquare,
  Plus,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function QuickActions() {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const [task, setTask] = useState("");

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );

  // =========================
  // CREATE TASK
  // =========================

  const handleCreateTask = async () => {
    if (!task.trim()) {
      alert("Please enter a task name.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title: task.trim(),
    });

    if (error) {
      console.error(error);
      alert("Failed to create task.");
      return;
    }

    alert("Task created successfully!");

    setTask("");
    setShowTaskModal(false);
  };

  // =========================
  // ADD EVENT
  // =========================

  const handleAddEvent = async () => {
    if (!eventName.trim() || !eventDate) {
      alert("Please fill all event fields.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      return;
    }

    const { error } = await supabase.from("events").insert({
      user_id: user.id,
      title: eventName.trim(),
      event_date: eventDate,
    });

    if (error) {
      console.error(error);
      alert("Failed to create event.");
      return;
    }

    alert("Event created successfully!");

    setEventName("");
    setEventDate("");
    setShowEventModal(false);
  };

  // =========================
  // SCHEDULE MEETING
  // =========================

  const handleScheduleMeeting = async () => {
    if (!meetingTitle.trim() || !meetingDate || !meetingTime) {
      alert("Please fill all meeting fields.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      return;
    }

    const { error } = await supabase.from("meetings").insert({
      user_id: user.id,
      title: meetingTitle.trim(),
      meeting_date: meetingDate,
      meeting_time: meetingTime,
    });

    if (error) {
      console.error(error);
      alert("Failed to schedule meeting.");
      return;
    }

    alert(
      `Meeting scheduled successfully!\n\n${meetingTitle}\n${meetingDate}\n${meetingTime}`
    );

    setMeetingTitle("");
    setMeetingDate("");
    setMeetingTime("");
    setShowMeetingModal(false);
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSendMessage = async () => {
    if (!recipient.trim() || !message.trim()) {
      alert("Please fill recipient and message.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      return;
    }

    /*
      Abhi hum message ko database me save nahi kar rahe.
      Pehle UI functionality test karenge.
    */

    console.log({
      user_id: user.id,
      recipient: recipient.trim(),
      message: message.trim(),
    });

    alert(
      `Message sent successfully!\n\nTo: ${recipient.trim()}\nMessage: ${message.trim()}`
    );

    setRecipient("");
    setMessage("");
    setShowMessageModal(false);
  };

  return (
    <>
      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <div>
        <h2 className="mb-6 text-2xl font-bold text-white">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-4">

          {/* CREATE TASK */}

          <button
            type="button"
            onClick={() => setShowTaskModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 p-4 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Task
          </button>

          {/* ADD EVENT */}

          <button
            type="button"
            onClick={() => setShowEventModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 p-4 font-semibold text-white transition hover:bg-green-700"
          >
            <CalendarPlus size={18} />
            Add Event
          </button>

          {/* SCHEDULE MEETING */}

          <button
            type="button"
            onClick={() => setShowMeetingModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-yellow-600 p-4 font-semibold text-white transition hover:bg-yellow-700"
          >
            <Video size={18} />
            Schedule Meeting
          </button>

          {/* SEND MESSAGE */}

          <button
            type="button"
            onClick={() => setShowMessageModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 p-4 font-semibold text-white transition hover:bg-purple-700"
          >
            <MessageSquare size={18} />
            Send Message
          </button>

        </div>
      </div>

      {/* =========================
          CREATE TASK MODAL
      ========================= */}

      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Create Task
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Add a new task to your dashboard.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            <label className="mb-2 block text-sm text-slate-300">
              Task Name
            </label>

            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task name..."
              className="mb-6 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
            />

            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="rounded-xl border border-white/10 px-5 py-3 text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateTask}
                disabled={!task.trim()}
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white hover:bg-cyan-600 disabled:opacity-50"
              >
                Create Task
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =========================
          ADD EVENT MODAL
      ========================= */}

      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Add Event
                </h2>

                <p className="text-sm text-slate-400">
                  Add a new event to your dashboard.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            <label className="mb-2 block text-sm text-slate-300">
              Event Name
            </label>

            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Team Meeting"
              className="mb-4 w-full rounded-xl bg-slate-950 px-4 py-3 text-white outline-none"
            />

            <label className="mb-2 block text-sm text-slate-300">
              Event Date
            </label>

            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="mb-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-white outline-none"
            />

            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="rounded-xl border border-white/10 px-5 py-3 text-slate-300"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddEvent}
                className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white"
              >
                Add Event
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =========================
          SCHEDULE MEETING MODAL
      ========================= */}

      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Schedule Meeting
                </h2>

                <p className="text-sm text-slate-400">
                  Schedule a client or team meeting.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMeetingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            <label className="mb-2 block text-sm text-slate-300">
              Meeting Title
            </label>

            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Client Meeting"
              className="mb-4 w-full rounded-xl bg-slate-950 px-4 py-3 text-white outline-none"
            />

            <label className="mb-2 block text-sm text-slate-300">
              Meeting Date
            </label>

            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="mb-4 w-full rounded-xl bg-slate-950 px-4 py-3 text-white outline-none"
            />

            <label className="mb-2 block text-sm text-slate-300">
              Meeting Time
            </label>

            <input
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="mb-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-white outline-none"
            />

            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowMeetingModal(false)}
                className="rounded-xl border border-white/10 px-5 py-3 text-slate-300"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleScheduleMeeting}
                className="rounded-xl bg-yellow-600 px-5 py-3 font-semibold text-white"
              >
                Schedule
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =========================
          SEND MESSAGE MODAL
      ========================= */}

      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Send Message
                </h2>

                <p className="text-sm text-slate-400">
                  Send a message to your client or team.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            <label className="mb-2 block text-sm text-slate-300">
              Recipient
            </label>

            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter name or email..."
              className="mb-4 w-full rounded-xl bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />

            <label className="mb-2 block text-sm text-slate-300">
              Message
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={5}
              className="mb-6 w-full resize-none rounded-xl bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />

            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="rounded-xl border border-white/10 px-5 py-3 text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!recipient.trim() || !message.trim()}
                className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send Message
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}