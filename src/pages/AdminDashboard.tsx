/** Cheeseful Bites owner workspace, backed directly by Supabase RLS policies. */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  EyeOff,
  ImageUp,
  MessageSquareText,
  Plus,
  RefreshCw,
  Save,
  ShieldAlert,
  Store,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";

type MenuDraft = {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  image: string;
  badge: string;
  available: boolean;
  sortOrder: number;
};

type ModerationReview = {
  id: number;
  rating: number;
  comment: string;
  status: "pending" | "published" | "hidden";
  created_at: string;
  author_name: string;
  menu_item_id: string;
};

const emptyDraft: MenuDraft = {
  id: "",
  title: "",
  category: "Paratha Roll",
  description: "",
  price: 0,
  image: "",
  badge: "",
  available: true,
  sortOrder: 0,
};

function FreePlanNotice({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`firebase-free-notice ${compact ? "firebase-free-notice--compact" : ""}`}>
      <div><ShieldAlert /><span className="eyebrow">Supabase free-plan guardrail</span></div>
      <h2>Confirmed email accounts are active.</h2>
      <p>Customer access uses Supabase email/password sign-up with email confirmation required. The project is on Supabase’s Free plan, and confirmation messages are delivered through the owner-configured Google SMTP service.</p>
      <ul>
        <li>No service-role key, SMTP password, or customer credential is exposed in this dashboard.</li>
        <li>The confirmed owner profile is granted the admin role through Supabase data-backed access controls.</li>
        <li>Restaurant menu, reviews, and future menu uploads are protected by Supabase row-level security.</li>
        <li>Google OAuth remains disabled; Google SMTP is used only for secure email delivery.</li>
      </ul>
    </section>
  );
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { items, isLoading: itemsLoading, refetch: refetchMenu } = useRestaurantMenu();
  const [reviews, setReviews] = useState<ModerationReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [draft, setDraft] = useState<MenuDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reviewMutationId, setReviewMutationId] = useState<number | null>(null);
  const [deletingMenu, setDeletingMenu] = useState(false);

  const loadReviews = useCallback(async () => {
    if (user?.role !== "admin") return;
    setReviewsLoading(true);
    const { data, error } = await supabase
      .from("menu_reviews")
      .select("id, rating, comment, status, created_at, author_name, menu_item_id")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setReviews((data ?? []) as ModerationReview[]);
    setReviewsLoading(false);
  }, [user?.role]);

  useEffect(() => { void loadReviews(); }, [loadReviews]);

  const pendingCount = useMemo(() => reviews.filter((review) => review.status === "pending").length, [reviews]);
  const updateDraft = <K extends keyof MenuDraft>(field: K, value: MenuDraft[K]) => setDraft((current) => current ? { ...current, [field]: value } : current);
  const itemExists = Boolean(draft && items.some((item) => item.id === draft.id));

  const startNewItem = () => {
    const highestOrder = Math.max(0, ...items.map((item) => item.sortOrder ?? 0));
    setDraft({ ...emptyDraft, sortOrder: highestOrder + 1 });
  };

  const startEdit = (index: number) => {
    const item = items[index];
    if (!item) return;
    setDraft({
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image,
      badge: item.badge ?? "",
      available: item.available !== false,
      sortOrder: item.sortOrder ?? index + 1,
    });
  };

  const saveDraft = async () => {
    if (!draft) return;
    if (!draft.id || !draft.title || !draft.description || !draft.image || draft.price <= 0) {
      toast.error("Please complete the ID, title, description, image, and positive price.");
      return;
    }
    setSaving(true);
    const payload = {
      id: draft.id,
      title: draft.title,
      category: draft.category,
      description: draft.description,
      price: draft.price,
      image: draft.image,
      badge: draft.badge || null,
      available: draft.available,
      sort_order: draft.sortOrder,
    };
    const result = itemExists
      ? await supabase.from("restaurant_menu_items").update(payload).eq("id", draft.id)
      : await supabase.from("restaurant_menu_items").insert(payload);
    if (result.error) {
      toast.error(result.error.message);
      setSaving(false);
      return;
    }
    await refetchMenu();
    setDraft(null);
    setSaving(false);
    toast.success(itemExists ? "Menu item updated and saved." : "Menu item created and saved.");
  };

  const deleteDraft = async () => {
    if (!draft || !itemExists) return;
    if (!window.confirm(`Delete ${draft.title}? This also removes its related review records.`)) return;
    setDeletingMenu(true);
    const { error } = await supabase.from("restaurant_menu_items").delete().eq("id", draft.id);
    if (error) toast.error(error.message);
    else {
      await refetchMenu();
      setDraft(null);
      toast.success("Menu item deleted.");
    }
    setDeletingMenu(false);
  };

  const uploadImage = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setUploading(true);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `menu/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("restaurant-media").upload(path, file, { contentType: file.type, upsert: false });
    if (error) toast.error(error.message);
    else {
      const { data } = supabase.storage.from("restaurant-media").getPublicUrl(path);
      updateDraft("image", data.publicUrl);
      toast.success("Image uploaded. Save the menu item to publish it.");
    }
    setUploading(false);
  };

  const moderate = async (id: number, status: "published" | "hidden") => {
    setReviewMutationId(id);
    const { error } = await supabase.from("menu_reviews").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Review ${status}.`);
      await loadReviews();
    }
    setReviewMutationId(null);
  };

  const deleteReview = async (id: number) => {
    if (!window.confirm("Delete this customer review permanently?")) return;
    setReviewMutationId(id);
    const { error } = await supabase.from("menu_reviews").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Review deleted.");
      await loadReviews();
    }
    setReviewMutationId(null);
  };

  if (loading) return <div className="admin-gate">Loading owner workspace…</div>;
  if (!user) return <div className="admin-gate"><ShieldAlert /><h1>Owner sign-in required</h1><p>Sign in with the Cheeseful Bites owner account to manage the menu and customer review queue.</p><button className="btn btn-orange" onClick={() => window.location.assign("/profile")}>Sign in</button><FreePlanNotice compact /></div>;
  if (user.role !== "admin") return <div className="admin-gate"><ShieldAlert /><h1>Owner access only</h1><p>This dashboard is reserved for the Cheeseful Bites owner account. Please sign in with the owner identity.</p><button className="btn btn-outline" onClick={() => window.location.assign("/profile")}>Switch account</button><FreePlanNotice compact /></div>;

  return (
    <DashboardLayout>
      <section className="admin-workspace">
        <header className="admin-workspace__header"><div><p className="eyebrow">Cheeseful Bites owner space</p><h1>Command the cheese.</h1><p>Update availability, pricing, product content, Supabase-hosted images, and real customer reviews in one place.</p></div><span className="admin-owner-chip"><Store />Owner mode</span></header>
        <FreePlanNotice />
        <div className="admin-metrics"><article><UtensilsCrossed /><b>{items.length}</b><span>menu items</span></article><article><ToggleRight /><b>{items.filter((item) => item.available !== false).length}</b><span>currently available</span></article><article><MessageSquareText /><b>{pendingCount}</b><span>reviews awaiting approval</span></article></div>
        <div className="admin-grid">
          <section className="admin-panel admin-panel--wide" id="menu-manager">
            <div className="admin-panel__heading"><div><p className="eyebrow">Live menu</p><h2>Menu manager</h2></div><div className="admin-panel__actions"><button className="btn btn-outline" disabled={itemsLoading || saving || uploading} onClick={() => void refetchMenu()}><RefreshCw />Refresh</button><button className="btn btn-orange" disabled={saving || uploading || itemsLoading} onClick={startNewItem}><Plus />New item</button></div></div>
            {itemsLoading ? <p className="admin-empty">Loading menu…</p> : <div className="admin-menu-list">{items.map((item, index) => <article key={item.id}><img src={item.image} alt="" /><div><b>{item.title}</b><small>{item.category} · Rs. {item.price}</small></div><span className={item.available !== false ? "status-chip is-live" : "status-chip"}>{item.available !== false ? "Available" : "Hidden"}</span><button className="admin-edit" onClick={() => startEdit(index)}>Edit</button></article>)}</div>}
          </section>
          <aside className="admin-panel admin-editor" data-testid="menu-editor">
            <div className="admin-panel__heading"><div><p className="eyebrow">{draft ? "Edit or add" : "Select an item"}</p><h2 data-testid="menu-editor-heading">{draft ? draft.title || "New menu item" : "Item editor"}</h2></div></div>
            {draft ? <div className="admin-form">
              <label>Unique ID<input value={draft.id} onChange={(event) => updateDraft("id", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="e.g. cheese-burger" /></label>
              <label>Item title<input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} /></label>
              <div className="admin-form__split"><label>Category<input value={draft.category} onChange={(event) => updateDraft("category", event.target.value)} /></label><label>Price (PKR)<input type="number" min="1" value={draft.price || ""} onChange={(event) => updateDraft("price", Number(event.target.value))} /></label></div>
              <label>Description<textarea value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} /></label>
              <label>Image URL<input value={draft.image} onChange={(event) => updateDraft("image", event.target.value)} placeholder="https://..." /></label>
              <label className="admin-upload"><span><ImageUp />Upload to Supabase Storage</span><input type="file" accept="image/*" disabled={uploading} onChange={(event) => void uploadImage(event.target.files?.[0])} /></label>
              <div className="admin-form__split"><label>Badge<input value={draft.badge} onChange={(event) => updateDraft("badge", event.target.value)} placeholder="Optional" /></label><label>Sort order<input type="number" min="0" value={draft.sortOrder} onChange={(event) => updateDraft("sortOrder", Number(event.target.value))} /></label></div>
              <button className={`availability-toggle ${draft.available ? "is-on" : ""}`} onClick={() => updateDraft("available", !draft.available)}>{draft.available ? <ToggleRight /> : <ToggleLeft />} {draft.available ? "Available to customers" : "Hidden from customers"}</button>
              <div className="admin-editor__actions"><button data-testid="menu-editor-cancel" className="btn btn-outline" onClick={() => setDraft(null)}>Cancel</button><button className="btn btn-red" onClick={() => void saveDraft()} disabled={saving || uploading || deletingMenu}><Save />{saving ? "Saving…" : "Save menu item"}</button>{itemExists && <button className="btn btn-outline btn-danger" onClick={() => void deleteDraft()} disabled={saving || uploading || deletingMenu}><Trash2 />{deletingMenu ? "Deleting…" : "Delete"}</button>}</div>
            </div> : <p data-testid="menu-editor-empty" className="admin-empty">Choose an item to edit it, or create a fresh menu item.</p>}
          </aside>
        </div>
        <section className="admin-panel review-panel" id="reviews">
          <div className="admin-panel__heading"><div><p className="eyebrow">Real customer submissions</p><h2>Customer review queue</h2></div><div className="admin-panel__actions"><span className="status-chip">{pendingCount} pending</span><button className="btn btn-outline" onClick={() => void loadReviews()} disabled={reviewsLoading}><RefreshCw />Refresh</button></div></div>
          {reviewsLoading ? <p className="admin-empty">Loading customer submissions…</p> : reviews.length ? <div className="review-queue">{reviews.map((review) => <article key={review.id}><div><b>{items.find((item) => item.id === review.menu_item_id)?.title || "Menu item"}</b><small>{review.author_name || "Signed-in customer"} · {review.rating}/5 stars</small><p>{review.comment}</p></div><span className={`review-status review-status--${review.status}`}>{review.status}</span><div className="review-actions"><button className="review-action review-action--publish" aria-label="Publish review" onClick={() => void moderate(review.id, "published")} disabled={reviewMutationId === review.id}><Check /></button><button className="review-action review-action--hide" aria-label="Hide review" onClick={() => void moderate(review.id, "hidden")} disabled={reviewMutationId === review.id}><EyeOff /></button><button className="review-action review-action--delete" aria-label="Delete review" onClick={() => void deleteReview(review.id)} disabled={reviewMutationId === review.id}><Trash2 /></button></div></article>)}</div> : <p className="admin-empty">No customer reviews have been submitted yet. New verified-customer reviews appear here for real moderation.</p>}
        </section>
      </section>
    </DashboardLayout>
  );
}
