"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  // The loading state is already true by default, so it shows loading on the first render
  const [loading, setLoading] = useState(true);

  // 1. Memoize the Supabase client so it doesn't recreate on every render
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
      ),
    []
  );

  // 2. Pure data fetching function (no state updates here)
  const fetchTasksData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, completed")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load tasks:", error);
      return [];
    }

    return data ?? [];
  };

  // 3. Handler for the "Refresh" button
  const handleRefresh = async () => {
    setLoading(true);
    const data = await fetchTasksData();
    setTasks(data);
    setLoading(false);
  };

  // 4. Initial load inside useEffect (asynchronous, no synchronous state updates)
  useEffect(() => {
    let isMounted = true;

    fetchTasksData().then((data) => {
      if (isMounted) {
        setTasks(data);
        setLoading(false);
      }
    });

    // Cleanup function to prevent state updates if the component unmounts early
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // Toggle task status
  const toggleTask = async (task: Task) => {
    const newStatus = !task.completed;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: newStatus })
      .eq("id", task.id);

    if (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task.");
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === task.id ? { ...item, completed: newStatus } : item
      )
    );
  };

  // Delete task
  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task.");
      return;
    }

    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Today&apos;s Tasks
        </h2>

        <button
          type="button"
          onClick={handleRefresh}
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="rounded-xl bg-slate-950 p-5 text-center text-slate-400">
          No tasks found.
        </p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-xl bg-slate-950 p-4 transition hover:bg-slate-800"
            >
              <button
                type="button"
                onClick={() => toggleTask(task)}
                className="text-left"
              >
                <span
                  className={`font-medium ${
                    task.completed
                      ? "text-slate-500 line-through"
                      : "text-white"
                  }`}
                >
                  {task.title}
                </span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleTask(task)}
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    task.completed
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {task.completed ? "Done" : "Pending"}
                </button>

                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="rounded-lg px-3 py-1 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}